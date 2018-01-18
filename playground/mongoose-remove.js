const {ObjectID} = require('mongodb');

const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/Todo');
const {User} = require('./../server/models/User');


// Todo.remove({}).then((result)=>{
//   console.log(result);
// })
//

// Todo.findOneAndRemove ({})
Todo.findByIdAndRemove('5a611ed475626a50a467a676').then((todo)=>{
  console.log(todo);
});
