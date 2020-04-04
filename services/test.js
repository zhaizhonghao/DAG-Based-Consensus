const neo4jDB = require('./neo4j-connector');

;(async () => {

    let parent = 'parent';
    let clientID = 1;

    neo4jDB.createEvent(parent,clientID);


})();