const neo4j = require('neo4j-driver');


class Neo4jDB {
    constructor(){
        this.uri = 'neo4j://localhost';
        this.user = 'neo4j';
        this.password = '1';
        this.driver = neo4j.driver(this.uri, neo4j.auth.basic(this.user, this.password));
    }

    async createInitEvent(event,clientID){
        let session = this.driver.session();
        try {
            let label = this.createLabel(clientID);
            const result = await session.run(
                `MERGE (a:`+label+` {parent: $parent,
                                selfParent : $selfParent,
                                clientID: $clientID,
                                eventID: $eventID,
                                stable : $stable,
                                timestamp : $timestamp,
                                hash: $hash}
                        )`,
                { 
                    selfParent : event.getSelfparent(),
                    parent : event.getParent(),
                    clientID : event.getClientid(),
                    eventID : event.getEventid(),
                    stable : event.getStable(),
                    timestamp : event.getTimestamp(),
                    hash : event.getHash()
                }
            )    
        } catch(error) {
            console.log(error);
        }finally{
            session.close();
        }
    }

    async createEvent(event,clientID){
        let session = this.driver.session();
        try {
            let label = this.createLabel(clientID);
            const result = await session.run(
                `
                MATCH (x:`+label+`{hash:$parent}),
                      (y:`+label+`{hash:$selfParent})
                MERGE (a:`+label+` {parent: $parent,
                                selfParent : $selfParent,
                                clientID: $clientID,
                                eventID: $eventID,
                                stable : $stable,
                                timestamp : $timestamp,
                                hash: $hash}
                        )
                MERGE (a)-[:IFROM]->(y)
                MERGE (a)-[:OFROM]->(x)`,
                { 
                    selfParent : event.getSelfparent(),
                    parent : event.getParent(),
                    clientID : event.getClientid(),
                    eventID : event.getEventid(),
                    stable : event.getStable(),
                    timestamp : event.getTimestamp(),
                    hash : event.getHash()
                }
            )
            //console.log(result);    
        } catch(error) {
            console.log(error);
        }finally{
            session.close();
        }
    }
    
    async getLatestEvent(clientID){
        const session = this.driver.session();
        try {
                let label = this.createLabel(clientID);
                const result = await session.run(
                    `
                    MATCH (x:`+label+`{clientID:$clientID}) where size(()-[]->(x))< 1 
                    return x 
                    `,
                    {
                        clientID:clientID                  
                    }
                ) 
                let events = [];
                for (let i = 0; i < result.records.length; i++) {
                    const record = result.records[i];
                    events.push(record.get(0).properties)
                }
                return events;         
            } catch(error){
                console.log(error);
            }finally {
            await session.close()
            }
    }

    async isEventExist(eventHash,clientID){
        const session = this.driver.session();
        try {
                let label = this.createLabel(clientID);
                const result = await session.run(
                    `
                    MATCH (x:`+label+`{hash:$eventHash})
                    return count(x) 
                    `,
                    {
                        eventHash:eventHash                  
                    }
                ) 
                const singleRecord = result.records[0];
                const node = singleRecord.get(0);
                return node.low-node.high == 0 ? false:true;
            } catch(error){
                console.log(error);
            }finally {
            await session.close()
            }
    }

    async getLatestEventIDofEachClient(clientID){
        const session = this.driver.session();
        try {
                let label = this.createLabel(clientID);
                const result = await session.run(
                    `
                    match (x:`+label+`)
                    return max(x.eventID),x.clientID
                    `,
                    {                                     
                    }
                )
                let res = [] 
                for (let i = 0; i < result.records.length; i++) {
                    const singleRecord = result.records[i];
                    let eventID = singleRecord.get(0);
                    let client = singleRecord.get(1);
                    let element = {
                        clientID:client,
                        eventID:eventID
                    }
                    res.push(element)
                }
                return res;
            } catch(error){
                console.log(error);
            }finally {
            await session.close()
            }
    }

    async getMissingEvents(clientID,client,eventID){
        const session = this.driver.session();
        try {
                let label = this.createLabel(clientID);
                const result = await session.run(
                    `
                    MATCH (x:`+label+`{clientID:$client})
                    WHERE x.eventID > $eventID
                    return x
                    order by x.eventID
                    `,
                    {
                        client:client,
                        eventID:eventID
                    }
                )
                let events = [];
                for (let i = 0; i < result.records.length; i++) {
                    const record = result.records[i];
                    events.push(record.get(0).properties)
                }
                return events; 
            } catch(error){
                console.log(error);
            }finally {
            await session.close()
            }
    }

    createLabel(clientID){
        let label = 'VIEW_'+clientID;
        return label;
    }

    destory(){
        this.driver.close();
    }

}

exports.Neo4jDB = Neo4jDB;