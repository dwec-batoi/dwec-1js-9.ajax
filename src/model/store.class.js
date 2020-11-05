const Product = require('./product.class');
const SERVER = 'http://localhost:3000';

class Store {
    constructor (id) {
        this.id = id;
    }

    findProduct(id) {
        return new Promise((resolve, reject) => {
            const peticion = new XMLHttpRequest();
            peticion.open('GET', SERVER + '/products/' + id);
            peticion.send();
            peticion.addEventListener('load', () => {
                if (peticion.status === 200) {
                    resolve(JSON.parse(peticion.responseText));
                } else {
                    reject("Error " + peticion.status + " (" + peticion.statusText + ") en la petición");
                }
            })
            peticion.addEventListener('error', () => {
                reject('Error en la petición HTTP');
            });
        })
    }

    getProducts() {
        return new Promise((resolve, reject) => {
            const peticion = new XMLHttpRequest();
            peticion.open('GET', SERVER + '/products');
            peticion.send();
            peticion.addEventListener('load', () => {
                if (peticion.status === 200) {
                    resolve(JSON.parse(peticion.responseText));
                } else {
                    reject("Error " + peticion.status + " (" + peticion.statusText + ") en la petición");
                }
            })
            peticion.addEventListener('error', () => {
                reject('Error en la petición HTTP');
            });
        })
    }

    getProductsByName(name) {
        return new Promise((resolve, reject) => {
            const peticion = new XMLHttpRequest();
            peticion.open('GET', SERVER + '/products?name=' + name);
            peticion.send();
            peticion.addEventListener('load', () => {
                if (peticion.status === 200) {
                    resolve(JSON.parse(peticion.responseText));
                } else {
                    reject("Error " + peticion.status + " (" + peticion.statusText + ") en la petición");
                }
            })
            peticion.addEventListener('error', () => {
                reject('Error en la petición HTTP');
            });
        })
    }

    addProduct(datosProd) {
        return new Promise((resolve, reject) => {
            const peticion = new XMLHttpRequest();
            peticion.open('POST', SERVER + '/products');
            peticion.setRequestHeader('Content-type', 'application/json');
            peticion.send(JSON.stringify(datosProd));
            peticion.addEventListener('load', () => {
                if (peticion.status === 201) {
                    resolve(JSON.parse(peticion.responseText));
                } else {
                    reject("Error " + peticion.status + " (" + peticion.statusText + ") en la petición");
                }
            })
            peticion.addEventListener('error', () => {
                reject('Error en la petición HTTP');
            });
        })
    }

    delProduct(id) {
        return new Promise((resolve, reject) => {
            const peticion = new XMLHttpRequest();
            peticion.open('DELETE', SERVER + '/products/' + id);
            peticion.send();
            peticion.addEventListener('load', () => {
                if (peticion.status === 200) {
                    resolve(JSON.parse(peticion.responseText));
                } else {
                    reject("Error " + peticion.status + " (" + peticion.statusText + ") en la petición");
                }
            })
            peticion.addEventListener('error', () => {
                reject('Error en la petición HTTP');
            });
        })
    }

    changeProduct(datosProd) {
        return new Promise((resolve, reject) => {
            const peticion = new XMLHttpRequest();
            peticion.open('PUT', SERVER + '/products/' + datosProd.id);
            peticion.setRequestHeader('Content-type', 'application/json');
            peticion.send(JSON.stringify(datosProd));
            peticion.addEventListener('load', () => {
                if (peticion.status === 200) {
                    resolve(JSON.parse(peticion.responseText));
                } else {
                    reject("Error " + peticion.status + " (" + peticion.statusText + ") en la petición");
                }
            })
            peticion.addEventListener('error', () => {
                reject('Error en la petición HTTP');
            });
        })
    }

    totalImport() {
        return 0;
    }
}

module.exports = Store;
