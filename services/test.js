// const neo4j = require('neo4j-driver');

// const uri = 'neo4j://localhost';
// const user = 'neo4j';
// const password = '1';
// const driver = neo4j.driver(uri, neo4j.auth.basic(user, password));



// // Create a company node
// function addCompany (tx, name) {
//     return tx.run('CREATE (a:Company {name: $name})', { name: name })
//   }
  
//   // Create a person node
//   function addPerson (tx, name) {
//     return tx.run('CREATE (a:Person {name: $name})', { name: name })
//   }
  
//   // Create an employment relationship to a pre-existing company node.
//   // This relies on the person first having been created.
//   function addEmployee (tx, personName, companyName) {
//     return tx.run(
//       'MATCH (person:Person {name: $personName}) ' +
//         'MATCH (company:Company {name: $companyName}) ' +
//         'CREATE (person)-[:WORKS_FOR]->(company)',
//       { personName: personName, companyName: companyName }
//     )
//   }
  
//   // Create a friendship between two people.
//   function makeFriends (tx, name1, name2) {
//     return tx.run(
//       'MATCH (a:Person {name: $name1}) ' +
//         'MATCH (b:Person {name: $name2}) ' +
//         'MERGE (a)-[:KNOWS]->(b)',
//       { name1: name1, name2: name2 }
//     )
//   }
  
//   // To collect friend relationships
//   const friends = []
  
//   // Match and display all friendships.
//   function findFriendships (tx) {
//     const result = tx.run('MATCH (a)-[:KNOWS]->(b) RETURN a.name, b.name')
  
//     result.subscribe({
//       onNext: record => {
//         const name1 = record.get(0)
//         const name2 = record.get(1)
  
//         friends.push({ name1: name1, name2: name2 })
//       }
//     })
//   }
  
//   // To collect the session bookmarks
//   const savedBookmarks = []
  
//   // Create the first person and employment relationship.
//   const session1 = driver.session({ defaultAccessMode: neo4j.WRITE })
//   const first = session1
//     .writeTransaction(tx => addCompany(tx, 'Wayne Enterprises'))
//     .then(() => session1.writeTransaction(tx => addPerson(tx, 'Alice')))
//     .then(() =>
//       session1.writeTransaction(tx =>
//         addEmployee(tx, 'Alice', 'Wayne Enterprises')
//       )
//     )
//     .then(() => {
//       savedBookmarks.push(session1.lastBookmark())
//     })
//     .then(() => session1.close())
  
//   // Create the second person and employment relationship.
//   const session2 = driver.session({ defaultAccessMode: neo4j.WRITE })
//   const second = session2
//     .writeTransaction(tx => addCompany(tx, 'LexCorp'))
//     .then(() => session2.writeTransaction(tx => addPerson(tx, 'Bob')))
//     .then(() =>
//       session2.writeTransaction(tx => addEmployee(tx, 'Bob', 'LexCorp'))
//     )
//     .then(() => {
//       savedBookmarks.push(session2.lastBookmark())
//     })
//     .then(() => session2.close())
  
//   // Create a friendship between the two people created above.
//   const last = Promise.all([first, second]).then(() => {
//     const session3 = driver.session({
//       defaultAccessMode: neo4j.WRITE,
//       bookmarks: savedBookmarks
//     })
  
//     return session3
//       .writeTransaction(tx => makeFriends(tx, 'Alice', 'Bob'))
//       .then(() =>
//         session3.readTransaction(findFriendships).then(() => session3.close())
//       )
//   })

// var set1 = new Set([]);              //集合。不重复的元素集合，不存在键值对
// // set1.add("name");                   //添加集合
// // if(set1.has("name")){               //检测集合是否存在指定元素
// //     set1.delete("name");            //删除集合元素
// //     set1.clear();                   //清空集合元素
// //     console.log(set1.size);         //集合大小
// // }
// var item = 'name';
// var item2 = 'name1';
// var item3 = 'name1';
// if(!set1.has(item)){
//     set1.add(item);
// }
// if(!set1.has(item2)){
//     set1.add(item2);
// }
// if(!set1.has(item3)){
//     set1.add(item3);
// }

// console.log(set1);

// let result = 1>2 ? true : false;
// console.log(result);


