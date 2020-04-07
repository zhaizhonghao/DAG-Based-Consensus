const Client = require('./modules/Client');
const NUM_OF_SUPER_CLIENT = 2;
const NUM_OF_SIMPLE_CLIENT = 2;

;(async () => {
    //create 2 superClient and start
    let superClients = []
    for (let i = 0; i < NUM_OF_SUPER_CLIENT; i++) {
        let client = new Client.Client(); 
        await client.init();
        console.log(`client ${client.getPeerInfo().id.toB58String()} is start : ${client.isStarted()}`);
        superClients.push(client);
    }
    //create 2 simple nodes
    var clients = []
    for (let i = 0; i < NUM_OF_SIMPLE_CLIENT; i++) {
        let client = new Client.Client(); 
        await client.init();
        console.log(`client ${client.getPeerInfo().id.toB58String()} is start : ${client.isStarted()}`);
        for (let j = 0; j < superClients.length; j++) {
            await client.dial(superClients[j].getPeerInfo());
            //await superClients[j].dial(client.getPeerInfo());
        }
        clients.push(client);
    }
    for (let j = 0; j < superClients.length; j++) {
        superClients[j].subscribe('news');
    }
    for (let i = 0; i < clients.length; i++) {
        await clients[i].subscribe('news');
    }
    clients[0].publish('news',1000);
})();




