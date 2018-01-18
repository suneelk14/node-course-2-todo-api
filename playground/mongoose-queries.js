const {ObjectID} = require('mongodb');
const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/Todo');
const {User} = require('./../server/models/User');
// var id = '5a60004d5d455533e4ca52ef' ;
//
// if(!ObjectID.isValid(id)){
//   console.log('ID not valid');
// }
// Todo.find({
//   _id:id
// }).then((todos)=>{
//   console.log('Todos', todos);
// });
//
// Todo.findOne({
//   _id:id
// }).then((todo)=>{
//   console.log('Todo', todo);
// });
//
// Todo.findById(id).then((todo)=>{
//   if(!todo)
//     return console.log ('Id not found');
//   console.log('Todo By Id', todo);
// }).catch((e)=>{
//   console.log(e);
// });

var userID = '5a5f7b10afa92d23b0efcd5c' ;

User.findById(userID).then ((user)=>{
  if(!user)
    return console.log('User with Id:', userID,  ' not found')
  console.log('UserByID :', user);
},(e)=>{
  console.log(e);
}) ;
