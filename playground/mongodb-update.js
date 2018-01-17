//const MongoClient=require('mongodb').MongoClient;
const {MongoClient, ObjectID}=require('mongodb');

MongoClient.connect('mongodb://localhost:27017', (err, client)=>{
  if(err)
    return console.log('Unable to connect to database:', err);
  console.log('Connected to MomgoDB server') ;

  const db = client.db('TodoApp');

  db.collection("Users").findOneAndUpdate(
    {_id: new ObjectID("5a3bb39e475e431cc41458e0")},
    {
      $set :{name:"Andrew"},
     $inc: { age: 1 }
    },
    {returnOriginal: false}
  ).then ((result)=>{ console.log(result)});



//  client.close() ;
} );
