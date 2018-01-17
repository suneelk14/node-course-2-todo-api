//const MongoClient=require('mongodb').MongoClient;
const {MongoClient, ObjectID}=require('mongodb');

MongoClient.connect('mongodb://localhost:27017', (err, client)=>{
  if(err)
    return console.log('Unable to connect to database:', err);
  console.log('Connected to MomgoDB server') ;

  const db = client.db('TodoApp');



  // db.collection('Todos').find({
  //     _id:new ObjectID('5a3bb060a19fd41ab464fe87')
  //   }).count().then((count)=>{
  //   console.log('Todos');
  //   console.log(count +' records found');
  // },(err)=>{
  //   console.log('Unable to fetch todos', err)
  // });

  // db.collection('Users').find({
  //     name:'Andrew'
  //   }).toArray((err, docs)=>{
  //     if(err)
  //         console.log('Unable to fetch users', err)
  //   console.log(docs);
  // },(err)=>{
  // });

  db.collection('Users').find({
      name:'Andrew'
    }).toArray().then((docs)=>{
      console.log(docs);
    }, (err)=>{
       console.log('Unable to fetch users', err);
    });
//  client.close() ;
} );
