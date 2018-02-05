const {ObjectID} = require('mongodb');
const jwt = require('jsonwebtoken');

const {Todo} = require('./../../models/Todo');
const {User} = require('./../../models/User');


const userOneId = new ObjectID() ;
const userTwoId = new ObjectID() ;
const users = [{
  _id: userOneId ,
  email: 'one@two.com',
  password: 'UserOnePassword',
  tokens:[{
    access: 'auth',
    token: jwt.sign({_id:userOneId, acess:'auth'},process.env.JWT_SECRET).toString()
  }]
},{
  _id: userTwoId ,
  email: 'two@two.com',
  password: 'UserTwoPassword',
  tokens:[{
    access: 'auth',
    token: jwt.sign({_id:userTwoId, acess:'auth'}, process.env.JWT_SECRET).toString()
  }]
}] ;

const todos = [{
  _id: new ObjectID() ,
  text: 'First test todo',
  _creator: userOneId
}, {
    _id :new ObjectID() ,
  text:'Second test todo',
  completed:true,
  completedAt: 444,
  _creator: userTwoId
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
