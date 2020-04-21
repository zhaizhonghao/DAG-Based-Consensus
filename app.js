const Client = require('./modules/Client');
const NUM_OF_SUPER_CLIENT = 2;
const NUM_OF_SIMPLE_CLIENT = 3;

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
        superClients[j].subscribe('hashgraph');
    }

    for (let i = 0; i < clients.length; i++) {
        clients[i].subscribe('hashgraph');
    }


    let counter = 0;

    var myInterval=setInterval(()=>{
        console.log('has publish',counter++,'times');  
        for (let i = 0; i < clients.length; i++) {
            let event = clients[i].getGenesisEvent();
            clients[i].getPeerInfo().multiaddrs.forEach((ma) => event.addAddresses(ma.toString()));
            let msg = event.serializeBinary();
            clients[i].publish('hashgraph',msg); 
        }
        for (let i = 0; i < superClients.length; i++) {
            let event = superClients[i].getGenesisEvent();
            superClients[i].getPeerInfo().multiaddrs.forEach((ma) => event.addAddresses(ma.toString()));
            //console.log(event.getAddressesList());
            let msg = event.serializeBinary();
            superClients[i].publish('hashgraph',msg); 
        }
    },100);
    
    function stopInterval(){
        clearTimeout(myInterval);
    //myInterval.unref();
    }
    setTimeout(stopInterval,1000);

    
    clients[0].handle('/missing');
    //To show the latest event of the client 0 
    setInterval(()=>{
        let lastestEvent = clients[0].getLatestEvent();
        if (lastestEvent) {
            clients[0].getPeerInfo().multiaddrs.forEach((ma) => lastestEvent.addAddresses(ma.toString()));
            let msg = lastestEvent.serializeBinary();
            clients[0].publish('hashgraph',msg); 
        }
        //clients[0].publish('hashgraph',)
    },1000);    
    //clients[0].publish('hashgraph',1000,msg);
})();




