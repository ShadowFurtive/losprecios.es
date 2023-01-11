'use strict';
/*jshint node: true */
/*jshint esversion: 6 */
const fs = require("fs");

// Nom del fitxer de text on es guarden els elements en format JSON.
const DB_FILENAME = "datos.json";


// Model de dades.
//
// Aquesta variable guarda tots els elements com un array d'objectes,
// on els atributs de cada objecte són els seus camps.
//
// Al principi aquesta variable conté tres elements, però desprès es crida a load()
// per carregar els elements guardats en el fitxer DB_FILENAME si existeix.
let datos = [];


/**
 *  Carrega els elements en format JSON del fitxer DB_FILENAME.
 *
 *  El primer cop que s'executa aquest mètode, el fitxer DB_FILENAME no
 *  existeix, i es produirà l'error ENOENT. En aquest cas es guardarà el
 *  contingut inicial.
 */
const load = () => {
  fs.readFile(DB_FILENAME, (err, data) => {
    if (err) {
      if (err.code === "ENOENT") {
        save();
        return;
      }
      throw err;
    }

    let json = JSON.parse(data);
    if (json) {
      datos = json;
    }
  });
};


/**
 *  Guarda els elements en format JSON en el fitxer DB_FILENAME.
 */
const save = () => {
  fs.writeFile(DB_FILENAME, JSON.stringify(datos),
    err => {
      if (err) throw err;
    });
};


exports.getAllCountries = (where) => {
  where  = (typeof where  !== 'undefined') ?  where : {};
  return new Promise((resolve, reject) => {
    datos.paises.map((e, i) => e.id = i);
    let t = datos.paises.filter(e => {
      for (let f in where) {
        let ok = false;
        if (where[f] instanceof Array) {
          let val = where[f][0];
          ok = e.name.toLowerCase().includes(val.toLowerCase());
        } else {// No operator means === operator
          ok = e === where[f];
        }
        if (!ok) return false;
      }
      return true;
    });
    resolve(JSON.parse(JSON.stringify(t)));
  });
};

exports.getAllProductsFromCountry = (id, where) => {
  where  = (typeof where  !== 'undefined') ?  where : {};
  return new Promise((resolve, reject) => {
    let datos_aux=datos.paises[id].productosList;
    const listaNueva =  datos_aux.map((item) =>{
      let valor = datos.productos.find((i) => i.id === item.id);
      return {
        ...item,
        name: valor.name,
      };
    });
    let val="";
    if(where[0].product != undefined) val = where[0].product[0];
    if(val != ""){
      let t = listaNueva.filter(e => { return e.name.toLowerCase().includes(val.toLowerCase()); });
      console.log(t);
      resolve(JSON.parse(JSON.stringify(t)));
    }
    else resolve(JSON.parse(JSON.stringify(listaNueva)));

  });
};

exports.checkUser = (user, password) => {
  return new Promise((resolve, reject) => {
    let valor = datos.usuarios.find((i) => i.user === user && i.password === password);
    if(!valor) reject(new Error(`El usuario no existe. Contacte con un administrador`));
    resolve(JSON.parse(JSON.stringify(valor)));
  });
}


exports.getAcces = (id, user_id) => {
  return new Promise((resolve, reject) => {
    let valor = datos.paises.find((i) => i.paisesId === parseInt(id) && i.usuariosId === parseInt(user_id));
    if(valor === undefined) valor=false;
    else valor=true;
    resolve(JSON.parse(JSON.stringify(valor)));
  });
}

exports.getProduct = idProducto => {
  return new Promise((resolve, reject) => {
    const dato = datos.productos.find((i) => i.id === parseInt(idProducto));
    if (typeof dato === "undefined") {
      reject(new Error(`El valor del parámetro id no es válido.`));
    } else {
      resolve(JSON.parse(JSON.stringify(dato)));
    }
  });
}; 

exports.modifyProduct = (idPais, idProducto, price) => {
  return new Promise((resolve, reject) => {
    const dato = datos.paises[idPais].productosList.find((i) => i.id === parseInt(idProducto));
    if (typeof dato === "undefined") {
      reject(new Error(`El valor del parámetro id no es válido.`));
    } else {
      datos.paises[idPais].productosList.forEach(element => {
        if (element.id === parseInt(idProducto)) {
          element.price = Number(price);
        }
      });
      save();
      resolve();
    }
  });
};


// Carrega els elements guardats en el fitxer si existeix.
load();
