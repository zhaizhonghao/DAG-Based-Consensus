# This a DAG-Based Consensus implementation
## Client
this a p2p node based on libp2p
## Design Plan
* STEP 1 
a p2p network with 2 normal nodes and 1 byzantine node
* STEP 2
a p2p network with 6 normal nodes and 2 byzantine node
## TODO LIST
1. p2p network with 100 nodes (completed)
2. every node can publish and subscribe msgs at the same time (completed)
3. draw the directed-acyclic-graph with the log of one node 
3. join less than 1/3 byzantine node
4. make consensus on the DAG

## Data structure
The structure of msg exchanged between nodes
```
{
  from: 'QmTUnVs1EkAmCz78CXeytAiU5YXc9hHwub8ZdkE7fxWoQW',
  data: <Buffer 6d 65 73 73 61 67 65 20 33>,
  seqno: <Buffer 12 14 21 66 10 42 f8 4d>,
  topicIDs: [ 'news' ],
  signature: <Buffer 4b ef 4c 66 29 31 3e f3 51 ab c9 f8 4b 81 23 51 a1 2e 02 5e 59 bd 28 23 9b 7a f7 4c 29 ba 83 53 cf 2c 36 ff 7c 1a 26 d1 3c 5c e1 ab e3 bf da 79 9b eb ... 206 more bytes>,
  key: <Buffer 08 00 12 a6 02 30 82 01 22 30 0d 06 09 2a 86 48 86 f7 0d 01 01 01 05 00 03 82 01 0f 00 30 82 01 0a 02 82 01 01 00 a9 0d 66 8f 16 9c 8d d4 2b 4d 43 b2 ... 249 more bytes>
}
```
we can use msg.data.toString() to check the content of msg, and use msg.from to get the sender.
## Database 
Since our algorithm is based on graph theory, we consider using the graph database--neo4j.
### Interaction the neo4j with RESTful API

### Commands can be used
* Count all the nodes in the graph
```
match(x) return count(x)
```
* Create the node with properties, for example
```
MATCH (ee:Person) WHERE ee.name = "Emil" RETURN ee;
```
* Create the nodes and edges with properties, for example
```
MATCH (ee:Person) WHERE ee.name = "Emil"
CREATE (js:Person { name: "Johan", from: "Sweden", learn: "surfing" }),
(ir:Person { name: "Ian", from: "England", title: "author" }),
(rvb:Person { name: "Rik", from: "Belgium", pet: "Orval" }),
(ally:Person { name: "Allison", from: "California", hobby: "surfing" }),
(ee)-[:KNOWS {since: 2001}]->(js),(ee)-[:KNOWS {rating: 5}]->(ir),
(js)-[:KNOWS]->(ir),(js)-[:KNOWS]->(rvb),
(ir)-[:KNOWS]->(js),(ir)-[:KNOWS]->(ally),
(rvb)-[:KNOWS]->(ally)
```
* Find the the node with specific properties

* Find the double spend node

* Check if the node can the some nodes 


