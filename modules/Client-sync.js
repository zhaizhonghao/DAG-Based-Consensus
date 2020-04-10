const Libp2p = require('libp2p')
const TCP = require('libp2p-tcp')
const Mplex = require('libp2p-mplex')
const SECIO = require('libp2p-secio')
const PeerInfo = require('peer-info')
const Gossipsub = require('libp2p-gossipsub')
const KadDHT = require('libp2p-kad-dht')
const eventFactory = require('./Event-Factory');
const neo4jDB = require('../services/neo4j-connetor-sync');

class Client {

    constructor(clientID){
      this.clientID = clientID;
      this.db = new neo4jDB.Neo4jDB();
      this.cache = new Set([]);
      this.sequence = [];
      this.lock = true;
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

    getGenesisEvent(){
      return this.genesisEvent;
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
              //store the event
              await this.db.createInitEvent(event,this.clientID);

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
                    if (this.clientID == 0) {
                      console.log(this.clientID,this.sequence);
                    }
                    this.sequence.splice(0,1);
                    //unlock
                    this.lock = !this.lock;
                    clearInterval(interval);
                  }
                } catch (error) {
                  console.log(error);
                }

              },1);
            }else{
              //check the event's parent
              let isParentExist = await this.db.isEventExist(event.getParent(),this.clientID);
              console.log('Is parent exist ?',event.getParent(),isParentExist);
              //then check the event's self-parent
              let isSelfParentExist = await this.db.isEventExist(event.getSelfparent(),this.clientID);
              console.log('Is self-parent exist ?',event.getSelfparent(),isSelfParentExist);
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
}

exports.Client = Client;