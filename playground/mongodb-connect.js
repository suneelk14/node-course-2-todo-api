//const MongoClient=require('mongodb').MongoClient;
const {MongoClient, ObjectID}=require('mongodb');

MongoClient.connect('mongodb://localhost:27017', (err, client)=>{
  if(err)
    return console.log('Unable to connect to database:', err);
  console.log('Connected to MomgoDB server') ;

  const db = client.db('TodoApp');

  // db.collection('Todos').insertOne({
  //   text:'Something to do',
  //   completed: false
  // },(err, res)=>{
  //   if(err)
  //     return console.log('Failed to insert record', err);
  //   console.log(JSON.stringify(res.ops, undefined, 2));
  // });
  // db.collection('Users').insertOne({
  //   name:'Andrew',
  //   age: 25,
  //   location: 'Philadelphia'
  // },(err, res)=>{
  //   if(err)
  //     return console.log('Failed to insert record', err);
  //   console.log(res.ops[0]._id.getTimestamp());
  // });
  client.close() ;
} );
