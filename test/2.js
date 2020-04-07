/**
 * Author: Zhai
 * Date : 2020/4/07
 * Description:
 * This demo shows a p2p network with 4 good nodes
 * two nodes publish the serialized event and the others subscribe the event and deserialize it.
 */
const Client = require('./../modules/Client');
const Schema = require('./../proto/event_pb');
const NUM_OF_SUPER_CLIENT = 2;
const NUM_OF_SIMPLE_CLIENT = 2;

;(async () => {
    let numOfClient = 0;
    //create 2 superClient and start
    let superClients = []
    for (let i = 0; i < NUM_OF_SUPER_CLIENT; i++) {
        let client = new Client.Client(numOfClient); 
        numOfClient++;
        await client.init();
        console.log(`client ${client.getPeerInfo().id.toB58String()} is start : ${client.isStarted()}`);
        superClients.push(client);
    }

    //create 2 simple nodes and start
    var clients = []
    for (let i = 0; i < NUM_OF_SIMPLE_CLIENT; i++) {
        let client = new Client.Client(numOfClient); 
        numOfClient++;
        await client.init();
        console.log(`client ${client.getPeerInfo().id.toB58String()} is start : ${client.isStarted()}`);
        for (let j = 0; j < superClients.length; j++) {
            await client.dial(superClients[j].getPeerInfo());
        }
        clients.push(client);
    }

    for (let j = 0; j < superClients.length; j++) {
        superClients[j].subscribe('hashgraph',(msg)=>{
            let event = Schema.Event.deserializeBinary(msg.data);
            console.log('From client',event.getClientid(),'with hash:',event.getHash());
        });
    }

    for (let i = 0; i < clients.length; i++) {
        clients[i].subscribe('hashgraph',(msg)=>{
            let event = Schema.Event.deserializeBinary(msg.data);
            console.log('From client',event.getClientid(),'with hash:',event.getHash());
        });
    }


    let counter = 0;

    var myInterval=setInterval(()=>{
        console.log('has publish',counter++,'times');  
        for (let i = 0; i < clients.length; i++) {
            let event = clients[i].getGenesisEvent();
            let msg = event.serializeBinary();
            clients[i].publish('hashgraph',msg); 
        }
        
    },100);
    
    function stopInterval(){
        clearTimeout(myInterval);
    //myInterval.unref();
    }
    setTimeout(stopInterval,1000);
    
    //clients[0].publish('hashgraph',1000,msg);
})();




