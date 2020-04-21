# This a DAG-Based Consensus implementation
## Client
this a p2p node based on libp2p
## Design Plan
### Basic function
every Client can publish and subscribe msgs at the same time (completed)
### STEP 1 without transactions
* Phase1
2 nodes
* Phase 2
n normal nodes
* Phase 3
3 normal nodes and 1 byzantine node
* Phase 4 
6 normal nodes and 2 byzantine nodes
* Phase 5
more than 2n/3 normal nodes and less than n/3 byzantine nodes
### STEP 2 with transactions
* Phase1
2 nodes
* Phase 2
n normal nodes
* Phase 3
3 normal nodes and 1 byzantine node
* Phase 4 
6 normal nodes and 2 byzantine nodes
* Phase 5
more than 2n/3 normal nodes and less than n/3 byzantine nodes

## Data structure
* Client
this a p2p node based on libp2p
* Event
```
event {
  parent : int64
  self-parent : int64
  timestamp : Timestamp
  clientID : int64
  hash : int64
  stable : boolean
}
```
* Message
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
* Transacton
TODO
## Database 
Since our algorithm is based on graph theory, we consider using the graph database--neo4j.
### Interaction the neo4j with RESTful API
TODO
### Interacat with the neo4j using nodejs-driver

### Commands can be used
* Count all the nodes in the graph
```
match(x) return count(x)
```
* Create the node with properties, for example
```
CREATE (js:Person { name: "Johan", from: "Sweden", learn: "surfing" })
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
* Find the the node with specific properties, for example
```
MATCH(ee:Person) WHERE ee.from='England' return ee
```
* Count the node with specific label
```
match(x) where labels(x)=['Person'] return count(x)
```
* Find the double spend node
TODO
* Check if the node can see some nodes 
```
match (x:Event),(y:Event),p=(x)-[*]->(y) where id(x)=3 and id(y)=0 return count(p)
```
if return 0, it means x has no path to y
otherwise, it means x has a path to y
* Create the node and connect to the existing node with specific properties, for example
```
match (x:Event) where id(x)=3
create (y:Event{data:'Data4'}),(y)-[:FROM]->(x)
return y
```
* Using WITH
```
match (x:Event) 
with count(x) as num
create (y:Event{clientID:num+1})
return y
```
* Using nested WITH
```
match (x:Event)
with count(x) as num
match (y:Event{clientID:num})
with y.clientID as iden
return iden
```
* Find the latest Event
```
match (x:Event)
with count(x) as num
match (y:Event{clientID:num})
return y
```
* IF-ELSE logic 
```
match (n:Person{name:'Johan'}) 
with n
foreach(ignoreMe in case when size(()-[]->(n)) > 0 then [1] else [] end |
create (y:Person{name:'zhai'}),
((n)-[:KNOWS]->(y))
)
```

## TODO LIST
1. p2p network with 100 nodes (completed)
2. every node can publish and subscribe msgs at the same time (completed)
3. draw the directed-acyclic-graph with the log of one node 
3. join less than 1/3 byzantine node
4. make consensus on the DAG

## params
|  N   | F  |
|  :----  | :----  |
|at least 2  | 1 pub / 100ms |


