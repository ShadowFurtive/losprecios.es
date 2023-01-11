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

const getAllPaisesController = (req, res, next) => {
  // components_model.getAll(...params)
  let params = (typeof req.query.params !== 'undefined') ? JSON.parse(req.query.params) : [];
  components_model.getAllCountries.apply(this, params)
  .then(countries => {
    res.status(201).send({
      success: 'true',
      message: countries,
    });
  })
  .catch(error => {next(Error(`DB Error:\n${error}`));});
};

const getAllPaisesProductsController = (req, res, next) => {
  let id = Number(req.params.id);
  let params = (typeof req.query.params !== 'undefined') ? JSON.parse(req.query.params) : [];
  components_model.getAllProductsFromCountry(id, params)
  .then(products => {
    res.status(201).send({
      success: 'true',
      message: products,
    });
  })
  .catch(error => {next(Error(`DB error:\n${error}`));});
};

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

const getProduct = (req, res, next) => {
  let id = Number(req.params.id);
  if(!id)
    throw Error('Id product are required');
  components_model.getProduct(id)
  .then((producto) => {
    res.status(201).send({
      success: 'true',
      message: producto,
    });
  })
  .catch(error => {next(Error(`Product for country doesn't exist:\n${error}`));});
};

const modifyProduct = (req, res, next) => {
  let idpais = Number(req.params.id);
  let {id, price} = req.body;
  if(!idpais || !id || !price)
    throw Error('Id product,  Id country and price are required');
  components_model.modifyProduct(idpais, id, price)
  .then(() => {
    res.status(201).send({
      success: 'true',
      message: 'Done',
    });
  })
  .catch(error => {next(Error(`Product for country doesn't exist:\n${error}`));});
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
app.post ('/paises/:id/product', modifyProduct);
app.get   ('/paises/:id',     getAllPaisesProductsController);
app.get   ('/product/:id',     getProduct);


app.use(errorController);

app.all('*', (req, res) =>
  res.status(409).send("Error: resource not found or method not supported")
);        


// Server started at port 8000
const PORT = 8000;
app.listen(PORT,
  () => {console.log(`Server running on port ${PORT}`);}
  );