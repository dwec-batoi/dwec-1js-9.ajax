const Product = require('./product.class');
const SERVER = 'http://localhost:3000';

class Store {
    constructor (id) {
        this.id = id;
        this.products = [];
    }

    findProduct(id) {
        return this.products.find((prod) => prod.id === id);
    }

    addProduct(datosProd, renderProd, setListeners) {
        const peticion = new XMLHttpRequest();
        peticion.open('POST', SERVER + '/products');
        peticion.setRequestHeader('Content-type', 'application/json');
        peticion.send(JSON.stringify(datosProd));
        peticion.addEventListener('load', () => {
          if (peticion.status === 201) {
            const datos = JSON.parse(peticion.responseText);
            const newProd = new Product(datos.id, datos.name, datos.price, datos.units);
            this.products.push(newProd);
            renderProd(newProd);
            setListeners(newProd);
          } else {
            throw "Error " + peticion.status + " (" + peticion.statusText + ") en la petición";
          }
        })
        peticion.addEventListener('error', () => {
            throw 'Error en la petición HTTP';
        });
    }

    delProduct(id) {
        this.products = this.products.filter((item) => item.id !== id);
        // Ya no devuelve nada
    }

    changeProductUnits(datosProd) {
        let prod = {};
        try {
            prod = this.findProduct(datosProd.id);
        } catch(err) {
            throw err;
        }

        let prodChanged = {};
        try {
            prodChanged = prod.changeUnits(datosProd.units);
        } catch(err) {
            throw err;
        }

        return prodChanged;
    }

    changeProduct(datosProd) {
        let prod = {};
        try {
            prod = this.findProduct(datosProd.id);
        } catch(err) {
            throw err;
        }

        for (let dato of ['name', 'price', 'units']) {
            if (datosProd[dato] !== undefined) {
                prod[dato] = datosProd[dato];
            }
        }
        return prod;
    }

    totalImport() {
        return this.products.reduce((total, prod) => total + prod.productImport(), 0);
    }

    underStock(stock) {
        return this.products.filter((prod) => prod.units < stock);
    }

    orderByUnits() {
        return this.products.sort((prodA, prodB) => prodB.units - prodA.units);
    }

    orderByName() {
        return this.products.sort((prodA, prodB) => prodA.name.localeCompare(prodB.name));
    }

    toString() {
        let cadena = `Almacén ${this.id} => ${this.products.length} productos: ${this.totalImport().toFixed(2)} €`;
        this.products.forEach((prod) => cadena += '\n- ' + prod);
        return cadena;
    }
}

function getId(prods) {
    return prods.reduce((max, prod) => prod.id > max ? prod.id : max, 0) + 1;
}

module.exports = Store;
