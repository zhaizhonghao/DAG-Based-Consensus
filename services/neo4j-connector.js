const neo4j = require('neo4j-driver');

const uri = 'neo4j://localhost';
const user = 'neo4j';
const password = '1';

exports.getGraph = async function(){
    const driver = neo4j.driver(uri, neo4j.auth.basic(user, password));
    const session = driver.session();
    try {
            const result = await session.run(
                `MATCH (x) where x.stable=false return x`,
                { }
            )
            for (let i = 0; i < result.records.length; i++) {
                const record = result.records[i];
                const node = record.get(0)
                console.log(node.properties);
            }
        } finally {
        await session.close()
        }
        // on application exit:
        await driver.close()
}

exports.createInitEvent = async function(event){
    const driver = neo4j.driver(uri, neo4j.auth.basic(user, password));
    const session = driver.session();
    try {
            let label = 'VIEW_'+event.getClientid();
            const result = await session.run(
                `CREATE (a:`+label+` {parent: $parent,
                                selfParent : $selfParent,
                                clientID: $clientID,
                                timestamp :$timestamp,
                                stable : $stable,
                                eventID:$eventID,
                                hash: $hash}
                        ) 
                RETURN a`,
                { 
                    selfParent : event.getSelfparent(),
                    parent : event.getParent(),
                    timestamp : event.getTimestamp().getSeconds(),
                    clientID : event.getClientid(),
                    eventID : event.getEventid(),
                    stable : event.getStable(),
                    hash : event.getHash()
                }
            )        
        } finally {
        await session.close()
        }
        // on application exit:
        await driver.close()
}

exports.createEvent = async function(event){
    const driver = neo4j.driver(uri, neo4j.auth.basic(user, password));
    const session = driver.session();
    try {
            let label = 'VIEW_'+event.getClientid();
            const result = await session.run(
                `
                MATCH (x{hash:$selfParent}),(y{hash:$parent})
                CREATE (a:`+label+` {parent: $parent,
                                selfParent : $selfParent,
                                clientID: $clientID,
                                timestamp :$timestamp,
                                stable : $stable,
                                eventID:$eventID,
                                hash: $hash}
                        ), 
                        (a)-[:FROM]->(x),
                        (a)-[:FROM]->(y)
                RETURN a`,
                { 
                    selfParent : event.getSelfparent(),
                    parent : event.getParent(),
                    timestamp : event.getTimestamp().getSeconds(),
                    clientID : event.getClientid(),
                    eventID : event.getEventid(),
                    stable : event.getStable(),
                    hash : event.getHash()
                }
            )                   
        } finally {
        await session.close()
        }
        // on application exit:
        await driver.close()
}

exports.isEventExist = async function(event){
    const driver = neo4j.driver(uri, neo4j.auth.basic(user, password));
    const session = driver.session();
    try {
            const result = await session.run(
                `MATCH (x{hash:$hash}) return count(x)`,
                { 
                    hash:event.getHash()
                }
            )
            const singleRecord = result.records[0]
            const node = singleRecord.get(0)
            if(node.low-node.high>0){
                return true;
            }else{
                return false;
            }
        } finally {
            await session.close()
            // on application exit:
            await driver.close()
        }
}

exports.getEventByHash = async function(hash){
    const driver = neo4j.driver(uri, neo4j.auth.basic(user, password));
    const session = driver.session();
    try {
        const result = await session.run(
            `MATCH (x{hash:$hash}) return x`,
            { 
                hash:hash
            }
        )
        const singleRecord = result.records[0]
        const node = singleRecord.get(0)
        return node.properties;
    } finally {
    await session.close()
    // on application exit:
    await driver.close()
    }

}



//find the hash of event by clientID
async function findLastestEventByClientID(clientID,driver){
    const session = driver.session();
    //find the latest event's id
    let eventID = await countEventsByClient(clientID,driver);
    //find the hash of the latest event by id and return
    const result = await session.run(
        `MATCH (x:Event {eventID: $eventID}) RETURN x`,
        { eventID:eventID}
    )
    const singleRecord = result.records[0]
    const node = singleRecord.get(0)
    
    return node.properties.hash;
}
//Some kind of wired
async function countEventsByClient(clientID,driver){
    const session = driver.session();
    const result = await session.run(
        `MATCH (x:Event {clientID: $clientID}) RETURN count(x)`,
        { clientID:clientID}
    )
    const singleRecord = result.records[0]
    const node = singleRecord.get(0)
    return node.low-node.high;
}


