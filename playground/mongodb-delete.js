//const MongoClient=require('mongodb').MongoClient;
const {MongoClient, ObjectID}=require('mongodb');

MongoClient.connect('mongodb://localhost:27017', (err, client)=>{
  if(err)
    return console.log('Unable to connect to database:', err);
  console.log('Connected to MomgoDB server') ;

  const db = client.db('TodoApp');
  // deleteMany
   db.collection('Users').deleteMany({name: 'Andrew'}).then((result)=>{
     console.log(result);
 });

  // // deleteOne
  // db.collection('Todos').deleteOne({text: 'Eat lunch'}).then((result)=>{
  //   console.log(result);
  // })

  // findOneAndDelete
  db.collection('Users').findOneAndDelete({_id: new ObjectID('5a3bb46e92f0c10f982c1097')}).then((result)=>{
    console.log(result);
  })


//  client.close() ;
} );
