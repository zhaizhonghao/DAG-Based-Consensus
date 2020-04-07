const neo4jDB = require('./neo4j-connector');
const eventFactory = require('./../modules/Event-Factory')

;(async () => {
    let initEvent1 = eventFactory.createEvent('','',1,0,false);
    await neo4jDB.createInitEvent(initEvent1);

    let initEvent2 = eventFactory.createEvent('','',2,0,false);
    await neo4jDB.createInitEvent(initEvent2);

    let event = eventFactory.createEvent(initEvent1.getHash(),initEvent2.getHash(),2,initEvent1.getEventid()+1,false);
    await neo4jDB.createEvent(event);

    let result = await neo4jDB.getEventByHash(event.getHash());
    console.log(result);

    let isExist = await neo4jDB.isEventExist(event.getHash(),2);
    console.log(isExist);

})();