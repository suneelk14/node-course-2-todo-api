var express = require('express');
var bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');

var {mongoose} = require('./db/mongoose.js');
var {Todo} = require('./models/Todo.js');
var {Uset} = require('./models/User.js');

var app = express() ;
const port = process.env.PORT || 3000 ;

app.use(bodyParser.json());

app.post('/todos', (req, res)=>{
  var todo = new Todo({text:req.body.text}) ;
  todo.save().then((doc)=>{
    res.send(doc);
  },(e)=>{
    res.status(400).send(e);
  });
});

app.get('/todos', (req, res)=>{
  Todo.find().then((todos)=>{
      res.send({todos});
    }, (e)=>{
          res.status(400).send(e);
      });
});

app.get('/todos/:id', (req, res)=>{
  id = req.params.id;
  if(!ObjectID.isValid(id))
    return res.status(404).send ({error:'Not a valid ID'});

  Todo.findById(id).then((todo)=>{
    if (!todo)
      return res.status(404).send('');
    res.send({todo});
  },(e)=>{
    res.status(400).send('');
  });
})


app.delete('/todos/:id', (req, res)=>{
  id = req.params.id;
  if(!ObjectID.isValid(id))
    return res.status(404).send ({error:'Not a valid ID'});
    Todo.findByIdAndRemove(id).then((todo)=>{
    if (!todo)
        return res.status(404).send('');
      res.send({todo});
    },(e)=>{
      res.status(400).send('');
    });
});
app.listen(port, ()=>{
  console.log(`Started on port ${port}`);
});

module.exports = {app};
