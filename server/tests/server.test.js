const expect = require('expect');
const request= require('supertest');
const {ObjectID} = require('mongodb');

const {app} = require('./../server');
const {Todo} = require('./../models/Todo');
const {User} = require('./../models/User');

const {todos, populateTodos, users, populateUsers} = require ('./seed/seed');

beforeEach(populateUsers) ;
beforeEach(populateTodos) ;


describe('POST /todos', ()=>{
  it('should create a new todo', (done)=>{
    var text ='Test todo text' ;

    request(app)
    .post('/todos')
    .send({text})
    .expect(200)
    .expect((res)=>{
      expect(res.body.text).toBe(text );
    })
    .end((err, res)=>{
      if(err){
        return done(err);
      }

      Todo.find({text}).then((todos)=>{
        expect(todos.length).toBe(1);
        expect(todos[0].text).toBe(text);
        done();
      }).catch((e)=>done(e));
    })
  });

  it('should not create todo with invalid body data', (done)=>{
    var text='';
    request(app)
    .post('/todos')
    .send({text})
    .expect(400)
    .end((err, res)=>{
      if(err){
        return done(err);
      }

      Todo.find().then((todos)=>{
        expect(todos.length).toBe(2);
          done();
      }).catch((e)=>done(e));
    })
  });
}) ;

describe('GET /todos', ()=>{
  it('should get all todos', (done)=>{
  request(app)
  .get('/todos')
  .expect(200)
  .expect((res)=>{
    expect(res.body.todos.length).toBe(2);
  })
  .end(done);
})
});

describe ('Get /todos/:id', ()=>{
  it('should return todo doc', (done)=>{
    id = todos[0]._id.toHexString() ;
    request(app)
    .get(`/todos/${id}`)
    .expect(200)
    .expect((res)=>{
      expect(res.body.todo.text).toBe(todos[0].text)
    })
    .end(done);
  });

  it('should return 404 if todo not found', (done)=>{
    id = new ObjectID().toHexString() ;
    request(app)
    .get(`/todos/${id}`)
    .expect(404)
    .end(done);
  });

  it('should return 404 for non ObjectIDs', (done)=>{
    id = 123 ;
    request(app)
    .get(`/todos/${id}`)
    .expect(404)
    .end(done);
  });
});

  describe ('DELETE /todos/:id', ()=>{
    it('should remove todo doc', (done)=>{
      var id = todos[1]._id.toHexString() ;
      request(app)
      .delete(`/todos/${id}`)
      .expect(200)
      .expect((res)=>{
        expect(res.body.todo._id).toBe(id) ;
      })
      .end((err, res)=>{
        if (err){
          return(done(err));
        }
       Todo.findById(id).then((todo)=>{
        expect(todo).toBe(null);
         done();
       }).catch((e)=>done(e));
    });
    });

    it('should return 404 if todo not found', (done)=>{
      id = new ObjectID().toHexString() ;
      request(app)
      .delete(`/todos/${id}`)
      .expect(404)
      .end(done);
    });

    it('should return 404 for non ObjectIDs', (done)=>{
      id = 123 ;
      request(app)
      .delete(`/todos/${id}`)
      .expect(404)
      .end(done);
    });
});

describe ('PATCH /todos/:id', ()=>{
  it('should update todo', (done)=>{
    var id = todos[0]._id.toHexString() ;
    var text =' Updated text - set completed to true'
    request(app)
    .patch(`/todos/${id}`)
    .send ({
      completed:true,
      text
    })
    .expect(200)
    .expect((res)=>{
      expect(res.body.todo.completed).toBe(true);
      expect(res.body.todo.text).toEqual(text) ;
      expect(typeof(res.body.todo.completedAt)).toBe('number');
  })
  .end(done);
  });

  it('should update todo', (done)=>{
    var id = todos[1]._id.toHexString() ;
    var text =' Updated text - Set completed to false'
    request(app)
    .patch(`/todos/${id}`)
    .send ({
      completed:false,
      text
    })
    .expect(200)
    .expect((res)=>{
      expect(res.body.todo.completed).toBe(false);
      expect(res.body.todo.text).toEqual(text) ;
      expect(res.body.todo.completedAt).toBe(null);
  })
  .end(done);
  });
});


describe ('Get /users/me', ()=>{
  it('should return user if authenticted', (done)=>{
    request(app)
    .get('/users/me')
    .set('x-auth', users[0].tokens[0].token)
    .expect(200)
    .expect((res)=>{
      expect(res.body._id).toBe(users[0]._id.toHexString());
      expect(res.body.email).toBe(users[0].email);
    })
    .end(done);
  });

  it('should return 401 if not authenticated', (done)=>{
    request(app)
    .get('/users/me')
    .expect(401)
    .expect((res)=>{
      expect(res.body).toEqual({})
    })
    .end(done()) ;
  });
});

describe('POST /users', ()=>{
  it('should create a user', (done)=>{
    var email='example@example.com';
    var password='123xyz';

    request(app)
    .post('/users')
    .send({email, password})
    .expect(200)
    .expect((res)=>{
      expect(res.headers['x-auth']).toBeDefined() ;
      expect(res.body._id).toBeDefined() ;
      expect(res.body.email).toBe(email);
    })
    .end((err)=>{
      if(err){
        return done(err);
      }

      User.findOne({email}).then((user)=>{
        expect(user).toBeDefined() ;
        expect(user.password).not.toBe(password);
        done() ;
      }).catch((e)=> done(e));
    });
  });

  it('should return validation errors if request invlid', (done)=>{
    var email='example@example.com';
    var invalidEmail='exampleexample.com';
    var password='123xyz';
    var invalidPassword='123';

    request(app)
    .post('/users')
    .send({invalidEmail, password})
    .expect(400);



    request(app)
      .post('/users')
      .send({email, invalidPassword})
      .expect(400)
      .end(done) ;


  });

  it('should not create a user if email in use', (done)=>{
    var duplicateEmail=users[0].email;
    var password='123xyz';

    request(app)
      .post('/users')
      .send({duplicateEmail, password})
      .expect(400)
    .end(done) ;

  });

});

describe('POST /users/login', ()=>{
  it('should login a user and return a token', (done)=>{
    request(app)
      .post('/users/login')
      .send({
        email:users[1].email,
        password:users[1].password
      })
      .expect(200)
      .expect((res)=>{
        expect(res.headers['x-auth']).toBeDefined() ;
      })
      .end((err, res)=> {
        if(err){
          return done(err);
        }
        User.findById(users[1]._id).then((user)=>{
          var token = user.tokens[0] ;
          // console.log('token: ', token);
          // console.log('x-ath: ', res.headers['x-auth']);
          expect(token.access).toBe('auth');
          expect(token.token).toBe(res.headers['x-auth']);
          done();

        }).catch((e)=> done(e));
      }) ;
  });

  it('should reject invalid login ', (done)=>{
    request(app)
      .post('/users/login')
      .send({
        email:users[1].email,
        password:users[1].password+'asdflj'
      })
      .expect(400)
      .expect((res)=>{
        expect(res.headers['x-auth']).not.toBeDefined() ;
      })
      .end((err, res)=> {
        if(err){
          return done(err);
        }
        User.findById(users[1]._id).then((user)=>{
          expect(user.tokens.length).toBe(0);
          done();

        }).catch((e)=> done(e));
      }) ;
  });

});

describe('DELETE /users/me/token', ()=>{
  it('should remove auth token on logout', (done)=>{
    request(app)
    .delete('/users/me/token')
    .set('x-auth', users[0].tokens[0].token)
    .expect(200)
    .end((err, res)=> {
      if(err){
        return done(err);
      }
      User.findById(users[0]._id).then((user)=>{
        expect(user.tokens.length).toBe(0);
        done();
      }).catch((e)=> done(e));
    }) ;
  })
}) ;
