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


/* Returns the number of elements that meet the conditions (where)
   where:  Object with conditions to filter the elements. Example:
           {a: 3, b: ['<', 5], c: ['includes', "A"]} computes a===3 && b<5 && c.includes("A") */
exports.countPaises = (where) => {
  where = (typeof where !== 'undefined') ?  where : {};
  return new Promise((resolve, reject) => {
    if (Object.keys(where).length === 0)
      resolve(datos.paises.length);
    else {
      let t = datos.paises.filter(e => {
        for (let f in where) {
          let ok = false;
          if (where[f] instanceof Array) {
            let operator = where[f][0];
            let val = where[f][1];
            switch(operator) {
              case "includes":
                ok = e[f].includes(val);
                break;
              case "!==":
                ok = e[f] !== val;
                break;
              case "<":
                ok = e[f] < val;
                break;
              case "<=":
                ok = e[f] <= val;
                break;
              case ">":
                ok = e[f] > val;
                break;
              case ">=":
                ok = e[f] >= val;
                break;
            }
          } else {// No operator means === operator
            ok = e[f] === where[f];
          }
          if (!ok) return false;
        }
        return true;
      });
      resolve(t.length);
    }
  });
};

exports.countPaisesProductos = (id, where) => {
  where = (typeof where !== 'undefined') ?  where : {};
  return new Promise((resolve, reject) => {
    if (Object.keys(where).length === 0)
      resolve(datos.paises[id].product_list.length);
    else {
      let t = datos.paises[id].product_list.filter(e => {
        for (let f in where) {
          let ok = false;
          if (where[f] instanceof Array) {
            let operator = where[f][0];
            let val = where[f][1];
            switch(operator) {
              case "includes":
                ok = e[f].includes(val);
                break;
              case "!==":
                ok = e[f] !== val;
                break;
              case "<":
                ok = e[f] < val;
                break;
              case "<=":
                ok = e[f] <= val;
                break;
              case ">":
                ok = e[f] > val;
                break;
              case ">=":
                ok = e[f] >= val;
                break;
            }
          } else {// No operator means === operator
            ok = e[f] === where[f];
          }
          if (!ok) return false;
        }
        return true;
      });
      resolve(t.length);
    }
  });
};


/* Returns (limit) elements that meet the conditions (where) bypassing the first (offset).
   where:  Object with conditions to filter the elements. Example:
           {a: 3, b: ['<', 5], c: ['includes', "A"]} computes a===3 && b<5 && c.includes("A")
   order:  Object with fields+booleans to sort the element. Example:
           {a: true, b: false} Ascending order by a field and descending order by b field.
   offset: First elements to bypass. 0 to start by the first.
   limit:  Number of elements to return. 0 to reach the last. */
exports.getAllCountries = (where, order, offset, limit) => {
  where  = (typeof where  !== 'undefined') ?  where : {};
  order  = (typeof order  !== 'undefined') ?  order : {};
  offset = (typeof offset !== 'undefined') ?  offset : 0;
  limit  = (typeof limit  !== 'undefined') ?  limit : 0;
  return new Promise((resolve, reject) => {
    resolve(JSON.parse(JSON.stringify(datos.paises)));
  });
};

exports.getAllProductsFromCountry = (id, where, order, offset, limit) => {
  where  = (typeof where  !== 'undefined') ?  where : {};
  order  = (typeof order  !== 'undefined') ?  order : {};
  offset = (typeof offset !== 'undefined') ?  offset : 0;
  limit  = (typeof limit  !== 'undefined') ?  limit : 0;
  return new Promise((resolve, reject) => {
    let datos_aux=datos.paises[id].product_list;
    const listaNueva =  datos_aux.map((item) =>{
      let valor = datos.producto.find((i) => i.id === item.id);
      return {
        ...item,
        name: valor.name,
      };
    });
    resolve(JSON.parse(JSON.stringify(listaNueva)));
  });
};


/* Returns the element identified by (id).
   id: Element identification. 
exports.get = id => {
  return new Promise((resolve, reject) => {
    const task = datos[id];
    if (typeof task === "undefined") {
      reject(new Error(`El valor del parámetro id no es válido.`));
    } else {
      resolve(JSON.parse(JSON.stringify(task)));
    }
  });
}; */

/* Adds a new element
   title: String with the task title.
   done: Boolean explaining if the task is done or not. 
exports.add = (title, done) => {
  done = (typeof done !== 'undefined') ?  done : false;  
  return new Promise((resolve, reject) => {
    datos.push({
      title: (title || "").trim(),
      done
    });
    save();
    resolve();
  });
}; */


/* Updates the element identified by (id).
   id: Element identification.
   title: String with the task title.
   done: Boolean explaining if the task is done or not. */
exports.update = (idPais, idProducto, price) => {
  return new Promise((resolve, reject) => {
    const dato = datos.paises[idPais].product_list[idProducto];
    if (typeof dato === "undefined") {
      reject(new Error(`El valor del parámetro id no es válido.`));
    } else {
      datos.paises[idPais].product_list[idProducto].price=price;
      save();
      resolve();
    }
  });
};


/* Deletes the element identified by (id).
   id: Element identification. 
exports.delete = id => {
  return new Promise((resolve, reject) => {
    const task = datos[id];
    if (typeof task === "undefined") {
      reject(new Error(`El valor del parámetro id no es válido.`));
    } else {
      datos.splice(id, 1);
      save();
      resolve();
    }
  });
}; */



// Carrega els elements guardats en el fitxer si existeix.
load();