const Libp2p = require('libp2p')
const TCP = require('libp2p-tcp')
const Mplex = require('libp2p-mplex')
const SECIO = require('libp2p-secio')
const PeerInfo = require('peer-info')
const Gossipsub = require('libp2p-gossipsub')
const KadDHT = require('libp2p-kad-dht')
const eventFactory = require('./Event-Factory');
const neo4jDB = require('../services/neo4j-connetor');
const statusFactory = require('./Status-Factory');
const PeerId = require('peer-id')
const pipe = require('it-pipe')


class Client {

    constructor(clientID){
      this.clientID = clientID;
      this.db = new neo4jDB.Neo4jDB();
      //To filter the same events
      this.cache = new Set([]);
      //To cache the coming events
      this.sequence = [];
      this.lock = true;
      this.lastestEvent = null;
    }

    async init(){
       this.gossipNode = await this.createNode();
       this.initEvent();
    }

    async initEvent(){
      console.log('init event');
      this.genesisEvent = eventFactory.createEvent('','',this.clientID,0,false);
      await this.db.createInitEvent(this.genesisEvent,this.clientID);
    }

    getClientId(){
      return this.clientID;
    }

    getGenesisEvent(){
      return this.genesisEvent;
    }

    getLatestEvent(){
      return this.lastedEvent;
    }

    async createNode() {
        const peerInfo = await PeerInfo.create()
        peerInfo.multiaddrs.add('/ip4/0.0.0.0/tcp/0')
        const node = await Libp2p.create({
          peerInfo,
          modules: {
            transport: [TCP],
            streamMuxer: [Mplex],
            connEncryption: [SECIO],
            pubsub: Gossipsub,
            dht: KadDHT
          },
          config: {
              pubsub: {
                enabled: true,
                //to make the publishing node not receive its own publish message
                emitSelf: false
              },
              dht: {
                  enabled: true
              }
            }
        })
        await node.start()
        return node
    }
    
    getPeerInfo(){
      return this.gossipNode.peerInfo;
    }

    dial(peerInfo){
      this.gossipNode.dial(peerInfo);
    }

    subscribe(topic){
      this.gossipNode.pubsub.subscribe(topic,async (msg)=>{
        try {
          //deserialize the received msg to Event
          let event = eventFactory.deserializeBinaryToEvent(msg.data);
          //only handler the event that is never received before
          if(!this.cache.has(event.getHash())){
            this.cache.add(event.getHash());
            this.sequence.push(event.getHash());
            //check whether the parents of the event are in the node's graph
            //if the event has no parent and self-parent, then story the event
            if (event.getParent()=='' && event.getSelfparent()=='') {
              //store the coming event
              await this.db.createInitEvent(event,this.clientID);
              //create an new event to record the coming event
              await this.createNewEvent(event);

            }else{
              //check the event's parent
              let isParentExist = await this.db.isEventExist(event.getParent(),this.clientID);
              console.log('Is parent exist ?',event.getParent(),isParentExist,'in client',this.clientID);
              //if event's parent is missing, ask for its parent
              
              //then check the event's self-parent
              let isSelfParentExist = await this.db.isEventExist(event.getSelfparent(),this.clientID);
              console.log('Is self-parent exist ?',event.getSelfparent(),isSelfParentExist,'in client',this.clientID);
              //if event's self-parent is missing, ask for its self-parent

              //if the parent and self-parent of the event is both existed, store the coming event and creating a new event to record it,
              // otherwise ask for missing event
              if (isParentExist&&isSelfParentExist) {
                //store the coming event
                await this.db.createEvent(event);
                //create a new event to record it
                this.createNewEvent(event);
              }
              else
              {
                //step1: store the coming event temporarily

                //step2: send the lastest eventID of each client in its view to the pub peer
                //get the latest eventID and insert into its current status
                let res = await this.db.getLatestEventIDofEachClient(this.clientID);
                let status = statusFactory.createStatus();
                status.setNodeid(this.gossipNode.peerInfo.id.toB58String());
                for (let i = 0; i < res.length; i++) {
                  const element = res[i];
                  let viewOfClient = statusFactory.createViewOfClient(element.clientID,element.eventID);
                  status.addViews(viewOfClient);
                }
                //insert the address into the status
                this.getPeerInfo().multiaddrs.forEach((ma) => status.addAddresses(ma.toString()));
                let request = status.serializeBinary();

                //extract the peerInfo of msg
                let address = event.getAddressesList();
                let peerId = PeerId.createFromB58String(msg.from);
                let peerInfo = await PeerInfo.create(peerId);
                for (let i = 0; i < address.length; i++) {
                  const element = address[i];
                  peerInfo.multiaddrs.add(element)
                }
                //dial the publisher and ask the missing events
                const { stream: stream } = await this.gossipNode.dialProtocol(peerInfo, ['/missing'])
                await pipe(
                  [request],
                  stream
                )
              }
            }
          }

        } catch (error) {
          console.log(error);
        }
      });
    }

    publish(topic,msg){
        this.gossipNode.pubsub.publish(topic, Buffer.from(msg))
    }

    isStarted(){
      return this.gossipNode.isStarted();
    }

    handleMissingRequest(protocol){
      let clientID = this.clientID;
      let db = this.db;
      let node  = this.gossipNode;
      this.gossipNode.handle(protocol, ({ stream }) => {
        pipe(
          stream,
          async function (source) {
            for await (const msg of source) {
              let status = statusFactory.deserializeBinaryToStatus(msg._bufs[0]);
              //To get the requested missing event
              let views = status.getViewsList();
              let missingEvents = eventFactory.createMessage();
              for (let i = 0; i < views.length; i++) {
                const view = views[i];
                let events = await db.getMissingEvents(clientID,view.getClientid(),view.getEventid())
                for (let i = 0; i < events.length; i++) {
                  const element = events[i];
                  let newEvent = eventFactory.convertJSONToEvent(element);
                  missingEvents.addEvents(newEvent);
                }
              }
              //feedback
              let feedback = missingEvents.serializeBinary();
              //exact the peerInfo
              let address = status.getAddressesList();
              let peerId = PeerId.createFromB58String(status.getNodeid());
              let peerInfo = await PeerInfo.create(peerId);
              for (let i = 0; i < address.length; i++) {
                const element = address[i];
                peerInfo.multiaddrs.add(element)
              }
              //dial the publisher and feedback the missing events
              const { stream: stream } = await node.dialProtocol(peerInfo, ['/feedback'])
              await pipe(
                [feedback],
                stream
              )
            }
          }
        )
      })
    }

    handleFeedback(protocol){
      let clientID = this.clientID;
      let db = this.db;
      this.gossipNode.handle(protocol, ({ stream }) => {
        pipe(
          stream,
          async function (source) {
            for await (const msg of source) {
              let feedback = eventFactory.deserializeBinaryToMessage(msg._bufs[0])
              let events = feedback.getEventsList();
              //store these missing events
              for (let i = 0; i < events.length; i++) {
                const event = events[i];
                await db.createEvent(event,clientID);
              }
              //create an new event to record

            }
          }
        )
      })
    }

    async createNewEvent(event){
      let interval = setInterval(async()=>{
        try {             
          //FIFO
          if (this.lock && this.sequence[0] == event.getHash()) {
            //lock
            this.lock = !this.lock;
            let lastedEvent = await this.db.getLatestEvent(this.clientID);
            //console.log('lasted event1',lastedEvent);
            //create a new event to record the coming event
            let newEvent = eventFactory.createEvent(lastedEvent[0].hash,
                                          event.getHash(),
                                          this.clientID,
                                          lastedEvent[0].eventID+1,false);
            await this.db.createEvent(newEvent,this.clientID);
            this.lastedEvent = newEvent;
            if (this.clientID == 0) {
              console.log(this.clientID,this.sequence);
            }
            this.sequence.splice(0,1);
            //TODO clear the cache
            //unlock
            this.lock = !this.lock;
            clearInterval(interval);
          }
        } catch (error) {
          console.log(error);
        }
      },1);
    }
}

exports.Client = Client;