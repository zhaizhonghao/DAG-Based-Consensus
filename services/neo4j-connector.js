const neo4j = require('neo4j-driver');

const uri = 'neo4j://localhost';
const user = 'neo4j';
const password = '1';

exports.createInitEvent = async function(event,clientID){
    const driver = neo4j.driver(uri, neo4j.auth.basic(user, password));
    const session = driver.session();
    try {
            let label = createLabel(clientID);
            const result = await session.run(
                `MERGE (a:`+label+` {parent: $parent,
                                selfParent : $selfParent,
                                clientID: $clientID,
                                stable : $stable,
                                hash: $hash}
                        ) 
                ON CREATE SET a.timestamp = timestamp()
                RETURN a`,
                { 
                    selfParent : event.getSelfparent(),
                    parent : event.getParent(),
                    clientID : event.getClientid(),
                    stable : event.getStable(),
                    hash : event.getHash()
                }
            )
            const singleRecord = result.records[0]
            const node = singleRecord.get(0)
            return node.properties;       
        } finally {
        await session.close()
        }
        // on application exit:
        await driver.close()
}

exports.createEvent = async function(newEvent,parentEvent){
    const driver = neo4j.driver(uri, neo4j.auth.basic(user, password));
    const session = driver.session();
    try {
            let label = createLabel(newEvent.getClientid());
            //console.log('clientID',newEvent.getClientid(),'parentClientID',parentEvent.getClientid());
            const result = await session.run(
                `
                    MERGE (a:`+label+` {
                    parent: $parent,
                    clientID: $clientID,
                    stable : $stable}
                ) 
                ON CREATE SET a.timestamp = timestamp()
                RETURN a
                `,
                { 
                    parent : newEvent.getParent(),
                    clientID : newEvent.getClientid(),
                    stable : newEvent.getStable()
                }
            )              
        } finally {
        await session.close()
        // on application exit:
        await driver.close()
        }
        
}
/**
 * since the event(A) is created for recording the coming event(B),
 * A's parent is B
 */
exports.createParentEdge = async function(event){
    const driver = neo4j.driver(uri, neo4j.auth.basic(user, password));
    const session = driver.session();
    try {
            let label = createLabel(event.getClientid());
            const result = await session.run(
                `
                    MATCH(y:`+label+`{hash:$parentHash}),
                    (x:`+label+`{clientID:$clientID,parent:$parentHash})
                    MERGE (x)-[:OFROM]->(y)
                `,
                { 
                    parentHash : event.getParent(),
                    clientID : event.getClientid()
                }
            )            
        } finally {
        await session.close()
        // on application exit:
        await driver.close()
        }
}
/**
 * Since the event(A) for recording the coming event is created by client with clientID,
 * we record the event ordered by timestamp, notice that if the event's indegree is not 0,
 * it has been some event's self-parent
 */
exports.createSelfParentEdge = async function(event,selfParentFlag){
    console.log('selfParentFlag',selfParentFlag);
    const driver = neo4j.driver(uri, neo4j.auth.basic(user, password));
    const session = driver.session();
    try {
            let label = createLabel(event.getClientid());
            const result = await session.run(
                `
                    MATCH(y:`+label+`{clientID:$clientID,parent:$selfParentFlag}),
                    (x:`+label+`{clientID:$clientID,parent:$parent})
                    where size(()-[]->(y)) < 1
                    MERGE (x)-[:IFROM]->(y)
                    ON CREATE SET x.selfParent = y.timestamp
                `,
                { 
                    clientID : event.getClientid(),
                    selfParentFlag : selfParentFlag,
                    parent : event.getParent()
                }
            )               
        } finally {
        await session.close()
        // on application exit:
        await driver.close()
        }
}
/**
 * The function find the newly created events without self-parent,
 * we use indegree = 0 to reprent that event
 */
exports.getOtherNewEvents = async function(clientID){
    const driver = neo4j.driver(uri, neo4j.auth.basic(user, password));
    const session = driver.session();
    try {
            let label = createLabel(clientID);
            const result = await session.run(
                `
                match (x:`+label+`) where x.parent<>'' and size(()-[]->(x))< 1 
                return x order by x.timestamp
                `,
                {                  
                }
            ) 
            let events = [];
            for (let i = 0; i < result.records.length; i++) {
                const record = result.records[i];
                events.push(record.get(0).properties)
            }
            return events;         
        } finally {
        await session.close()
        // on application exit:
        await driver.close()
        }
}

exports.getNumOfNewEvents = async function(clientID){
    const driver = neo4j.driver(uri, neo4j.auth.basic(user, password));
    const session = driver.session();
    try {
            let label = createLabel(clientID);
            const result = await session.run(
                `
                    MATCH(x:`+label+`) where x.parent<>''
                    RETURN count(x)
                `,
                {                  
                }
            )   
            const singleRecord = result.records[0]
            const node = singleRecord.get(0)
            return node.low-node.high;          
        } finally {
        await session.close()
        // on application exit:
        await driver.close()
        }
}


exports.isEventExist = async function(hash,clientID){
    const driver = neo4j.driver(uri, neo4j.auth.basic(user, password));
    const session = driver.session();
    try {
            let label = createLabel(clientID);
            const result = await session.run(
                `MATCH (x:`+label+`{hash:$hash}) return count(x)`,
                { 
                    hash:hash
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




function createLabel(clientID){
    let label = 'VIEW_'+clientID;
    return label;
}


