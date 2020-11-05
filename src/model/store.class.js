const Product = require('./product.class');

class Store {
    constructor (id) {
        this.id = id;
        this.products = [];
    }

    findProduct(id) {
        return this.products.find((prod) => prod.id === id);
    }

    addProduct(datosProd) {
        datosProd.id = getId(this.products);
        let newProd = new Product(datosProd.id, datosProd.name, datosProd.price, datosProd.units);
        this.products.push(newProd);
        return newProd;
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
