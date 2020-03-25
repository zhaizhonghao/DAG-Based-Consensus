const Libp2p = require('libp2p')
const TCP = require('libp2p-tcp')
const Mplex = require('libp2p-mplex')
const SECIO = require('libp2p-secio')
const PeerInfo = require('peer-info')
const Gossipsub = require('libp2p-gossipsub')
const KadDHT = require('libp2p-kad-dht')
var fs = require('fs')

class Client {
    constructor(){
    }
    async init(){
       this.gossipNode = await this.createNode();
       console.log('1');
    }

    async createNode() {
      console.log('2');
        const peerInfo = await PeerInfo.create()
        peerInfo.multiaddrs.add('/ip4/0.0.0.0/tcp/0')
        console.log('3');
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
        console.log('4');
        await node.start()
        console.log('5');
        return node
    }
    getPeerInfo(){
      return this.gossipNode.peerInfo;
    }
    dial(peerInfo){
      this.gossipNode.dial(peerInfo);
    }
    subscribe(topic){
      console.log('sub');
      this.gossipNode.pubsub.subscribe(topic,(msg)=>{
        var record = `received: ${msg.data.toString()} from ${msg.from}\n`;
        fs.appendFile(`${__dirname}/db/${this.gossipNode.peerInfo.id.toB58String()}.txt`,record , (error)  => {
            if (error) return console.log("追加文件失败" + error.message);
            console.log("追加成功");
          });
      });
    }
    publish(topic){
      let counter = 0;
      setInterval(() => {
        counter++;
        this.gossipNode.pubsub.publish(topic, Buffer.from('message '+counter))
        console.log(counter);
      }, 1000)
    }
    isStarted(){
      return this.gossipNode.isStarted();
    }
    
}

exports.Client = Client;