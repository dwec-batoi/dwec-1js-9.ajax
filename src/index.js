'use strict'

// Aquí importaremos la clase del controlador e instanciaremos uno
const Controller = require('./controller/controller.class');

const myController = new Controller();

// A continuación crearemos una función manejadora para cada formulario
window.addEventListener('load', () => {
  myController.init();
})
