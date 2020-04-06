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
      await neo4jDB.createInitEvent(this.genesisEvent);
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

    subscribe(topic,callback){
      this.gossipNode.pubsub.subscribe(topic,(msg)=>{
        callback(msg);
        });
    }

    publish(topic,interval,msg){
      setInterval(() => {
        this.gossipNode.pubsub.publish(topic, Buffer.from(msg))
      }, interval)
    }

    isStarted(){
      return this.gossipNode.isStarted();
    }
}

exports.Client = Client;