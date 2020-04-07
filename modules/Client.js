const Libp2p = require('libp2p')
const TCP = require('libp2p-tcp')
const Mplex = require('libp2p-mplex')
const SECIO = require('libp2p-secio')
const PeerInfo = require('peer-info')
const Gossipsub = require('libp2p-gossipsub')
const KadDHT = require('libp2p-kad-dht')
const eventFactory = require('./Event-Factory');
const neo4jDB = require('./../services/neo4j-connector');

class Client {

    constructor(clientID){
      this.clientID = clientID;
    }

    async init(){
       this.gossipNode = await this.createNode();
       this.initEvent();
    }

    async initEvent(){
      console.log('init event');
      this.genesisEvent = eventFactory.createEvent('','',this.clientID,0,false);
      await neo4jDB.createInitEvent(this.genesisEvent,this.clientID);
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
          console.log(this.clientID+' get','From client',event.getClientid(),'with hash:',event.getHash());
          //check whether the parents of the event are in the node's graph
          //if the event has no parent and self-parent, then story the event
          if (event.getParent()=='' && event.getSelfparent()=='') {
            //store the event
            await neo4jDB.createInitEvent(event,this.clientID);
            let inDegree = await neo4jDB.getInDegreeOfEvent(event,this.clientID);
            //create an new event to record the receiving
            if (inDegree == 0) {
              let lastEvent = await neo4jDB.getLatestEvent(this.clientID);
              let newEvent = eventFactory.createEvent(
                lastEvent.hash,
                event.getHash(),
                this.clientID,
                lastEvent.eventID+1,
                false);
              await neo4jDB.createEvent(newEvent,this.clientID);
            }
          }else{
            //check the event's parent
            let isParentExist = await neo4jDB.isEventExist(event.getParent(),this.clientID);
            console.log('Is parent exist ?',event.getParent(),isParentExist);
            //then check the event's self-parent
            let isSelfParentExist = await neo4jDB.isEventExist(event.getSelfparent(),this.clientID);
            console.log('Is self-parent exist ?',event.getSelfparent(),isSelfParentExist);
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