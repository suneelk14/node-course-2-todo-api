const {ObjectID} = require('mongodb');
const jwt = require('jsonwebtoken');

const {Todo} = require('./../../models/Todo');
const {User} = require('./../../models/User');

const todos = [{
  _id: new ObjectID() ,
  text: 'First test todo'
}, {
    _id :new ObjectID() ,
  text:'Second test todo',
  completed:true,
  completedAt: 444
}] ;

const userOneId = new ObjectID() ;
const userTwoId = new ObjectID() ;
const users = [{
  _id: userOneId ,
  email: 'one@two.com',
  password: 'UserOnePassword',
  tokens:[{
    access: 'auth',
    token: jwt.sign({_id:userOneId, acess:'auth'}, 'abc123').toString()
  }]
},{
  _id: userTwoId ,
  email: 'two@two.com',
  password: 'UserTwoPassword',
}] ;

const populateTodos = (done) => {
  Todo.remove({}).then(()=>{
    return Todo.insertMany(todos);
  }).then (()=>done())
}

const populateUsers = (done) => {
  User.remove({}).then(()=>{
    var userOne = new User(users[0]).save() ;
    var userTwo = new User(users[1]).save() ;
    return Promise.all([userOne, userTwo])
  }).then(()=>done());
}

module.exports = {todos, populateTodos, users, populateUsers} ;