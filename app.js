const Client = require('./Client');


;(async () => {
    //create 2 superClient and start
    let superClients = []
    for (let i = 0; i < 2; i++) {
        let client = new Client.Client(); 
        await client.init();
        superClients.push(client);
    }
    //create 2 simple nodes
    var clients = []
    for (let i = 0; i < 2; i++) {
        let client = new Client.Client(); 
        await client.init();
        for (let j = 0; j < superClients.length; j++) {
            await client.dial(superClients[j].getPeerInfo());
            //await superClients[j].dial(client.getPeerInfo());
        }
        clients.push(client);
    }
    for (let j = 0; j < superClients.length; j++) {
        superClients[j].subscribe('news');
    }

    
    //await clients[0].dial(clients[1].getPeerInfo());
    await clients[1].subscribe('news');
    clients[0].publish('news');
})();




