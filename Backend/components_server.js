"use strict";
/*jshint esversion: 6 */
const express = require('express');
var cors = require('cors')
const app = express();

app.use(cors())

// Import MW for parsing POST params in BODY
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));

// Import MW supporting Method Override with express
const methodOverride = require('method-override');
app.use(methodOverride('_method'));

const components_model = require('./components_model');

// CONTROLLER

// GET /tasks/count
const countPaisesController = (req, res, next) => {
  let params = (typeof req.query.params !== 'undefined') ? JSON.parse(req.query.params) : [];
  // components_model.count(...params)
  components_model.countPaises(this, params)
  .then(total => {
    res.status(201).send({
      success: 'true',
      message: total,
    });
  })
  .catch(error => {next(Error(`DB Error:\n${error}`));});
};

const countPaisesProductsController = (req, res, next) => {
  let id = Number(req.params.id);
  let params = (typeof req.query.params !== 'undefined') ? JSON.parse(req.query.params) : [];
  // components_model.count(...params)
  components_model.countPaisesProductos(id, this, params)
  .then(total => {
    res.status(201).send({
      success: 'true',
      message: total,
    });
  })
  .catch(error => {next(Error(`DB Error:\n${error}`));});
};

// GET /, GET /tasks
const getAllPaisesController = (req, res, next) => {
  // components_model.getAll(...params)
  let params = (typeof req.query.params !== 'undefined') ? JSON.parse(req.query.params) : [];
  components_model.getAllCountries.apply(this, params)
  .then(tasks => {
    res.status(201).send({
      success: 'true',
      message: tasks,
    });
  })
  .catch(error => {next(Error(`DB Error:\n${error}`));});
};

// GET /tasks/1
const getAllPaisesProductsController = (req, res, next) => {
  let id = Number(req.params.id);
  let params = (typeof req.query.params !== 'undefined') ? JSON.parse(req.query.params) : [];
  components_model.getAllProductsFromCountry(id, this, params)
  .then((task) => {
    res.status(201).send({
      success: 'true',
      message: task,
    });
  })
  .catch(error => {next(Error(`DB error:\n${error}`));});
};

// POST /tasks
const loginController = (req, res, next) => {
  let {user, password} = req.body;
  if(!user || !password)
    throw Error('user and password is required');

  components_model.checkUser(user, password)
  .then((valor) => {
    res.status(201).send({
      success: 'true',
      message: valor.id,
    });
  })
  .catch(error => {next(Error(`User not exist:\n${error}`));});
};

const getAccesController = (req, res, next) => {
  let {id, user_id} = req.body;
  if(!id)
    throw Error('Id country are required');
  components_model.getAcces(id, user_id)
  .then((valor) => {
    res.status(201).send({
      success: 'true',
      message: valor,
    });
  })
  .catch(error => {next(Error(`User and country doesn't have correlation:\n${error}`));});
};

// PUT /tasks/1
const updateController = (req, res, next) => {
  let id = Number(req.params.id);
  let {title, done} = req.body;
  done = (typeof done !== 'undefined') ?  JSON.parse(done) : false;
  if(!title)
    throw Error('title is required');

  components_model.update(id, title, done)
  .then(() => {
    res.status(201).send({
      success: 'true',
      message: 'task updated successfully',
    });
  })
  .catch(error => {next(Error(`task not updated:\n${error}`));});
};

// PATCH /tasks/1/switch
const switchController = (req, res, next) => {
  let id = Number(req.params.id);
  components_model.get(id)
  .then(task => {
    components_model.update(id, task.title, !task.done)
    .then(() => {
      res.status(201).send({
        success: 'true',
        message: 'task updated successfully',
      });
    })
    .catch(error => {next(Error(`task not updated:\n${error}`));});
  })
  .catch(error => {next(Error(`A DB Error has occurred:\n${error}`));});
};

// DELETE /tasks/1
const deleteController = (req, res, next) => {
  let id = Number(req.params.id);
  components_model.delete(id)
  .then(() => {
    res.status(201).send({
      success: 'true',
      message: 'task deleted successfully',
    });
  })
  .catch(error => {next(Error(`task not deleted:\n${error}`));});
};

// PUT /tasks/reset
const resetController = (req, res, next) => {
  components_model.reset()
  .then(() => {
    res.status(201).send({
      success: 'true',
      message: 'tasks reseted successfully',
    });
  })
  .catch(error => {next(Error(`tasks not reseted:\n${error}`));});
};


const errorController = (err, req, res, next) => {
  if (req.originalUrl.includes('/api/'))
    res.status(409).send({
     success: 'false',
     message: err.toString(),
   });
  else
    res.status(409).send(err.toString());
};

// middleware to use for all requests
const logController = (req, res, next) => {
  // do logging
  console.log('req.method = ' + req.method);
  console.log('req.URL = ' + req.originalUrl);
  console.log('req.body = ' + JSON.stringify(req.body));
  console.log("======================");
  //console.log('req.path = ' + req.path);
  //console.log('req.route = ' + req.route);
  next(); // make sure we go to the next routes and don't stop here
};

// middleware to use for all requests
const headersController = (req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS, POST, PUT, PATCH, DELETE');
  next(); // make sure we go to the next routes and don't stop here
};


// ROUTER
app.use   ('*',                 logController);
app.use   ('*',                 headersController);

app.post ('/', loginController);
app.get   (['/', '/paises'],     getAllPaisesController);
app.post ('/paises', getAccesController);
app.get   ('/paises/count',     countPaisesController);
app.get   ('/paises/:id',     getAllPaisesProductsController);
app.get   ('/paises/:id/count',     countPaisesProductsController);

/* Add the 7 missing routes with the proper HTTP verbs that call to
   countController, getController, createController, updateController,
   switchController, deleteController and resetController functions.
   The server can be tested with these requests:
http http://localhost:8000/tasks/
http http://localhost:8000/tasks/count
http http://localhost:8000/tasks/2
http POST http://localhost:8000/tasks title="Task added" done=false --form
http PUT  http://localhost:8000/tasks/2 title="Task changed" --form
http PATCH http://localhost:8000/tasks/1/switch
http DELETE http://localhost:8000/tasks/0
http PUT http://localhost:8000/tasks/reset
*/

app.use(errorController);

app.all('*', (req, res) =>
  res.status(409).send("Error: resource not found or method not supported")
);        


// Server started at port 8000
const PORT = 8000;
app.listen(PORT,
  () => {console.log(`Server running on port ${PORT}`);}
  );