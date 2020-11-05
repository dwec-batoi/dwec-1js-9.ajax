const View = require('../view/view.class');
const Store = require('../model/store.class');

class Controller {
    constructor() {
        this.store = new Store(1);
        this.view = new View();
    }

    init() {
        // Hacemos el formulario que no lo valide el navegador
        document.getElementById('new-prod').setAttribute('novalidate', 'novalidate');
        // Y ponemos los listeners
        this._setListeners();  // el _ del nombre indica que sólo se usa dentro de esta clase
    }

    _setListeners() {
        const formProdUI = document.getElementById('new-prod');
        
        // Listener del submit formulario de añadir productos
        formProdUI.addEventListener('submit', (event) => {
            event.preventDefault();        
            const id = document.getElementById('newprod-id').value;
            // Validamos el formulario
            this._checkInputName();
            this._checkInputPrice();
            if (id) {   // Las uds sólo las valido si estoy editando
                this._checkInputUnits();
            }
            // Si NO es válido acabamos
            if (!formProdUI.checkValidity()) {
                return;
            }
            const name = document.getElementById('newprod-name').value;
            const units = document.getElementById('newprod-units').value;
            const price = document.getElementById('newprod-price').value; 
            const formData = { name, price: Number(price) };
            if (units) formData.units = Number(units);
            if (id) {
                formData.id = Number(id);
                this.changeProductInStore(formData);
            } else {
                this.addProductToStore(formData);
            }
        })        

        // Listener del reset formulario de añadir productos
        formProdUI.addEventListener('reset', (event) => {
            // si estoy modificando que no resetee sino que recargue
            const id = document.getElementById('newprod-id').value;
            if (id) {
                event.preventDefault();
                this.view.renderEditForm(this.store.findProduct(Number(id)));
            }
        })

        // Ponemos los listeners de los 'blur'
        document.getElementById('newprod-name').addEventListener('blur', this._checkInputName.bind(this));
        document.getElementById('newprod-price').addEventListener('blur', this._checkInputPrice.bind(this));
        document.getElementById('newprod-units').addEventListener('blur', this._checkInputUnits.bind(this));
    }
   
    _checkInputPrice() {
        const inputPriceUI = document.getElementById('newprod-price');
        // Le quitamos el error personalizado que pudiera tener de una validación anterior
        inputPriceUI.setCustomValidity('');
        // Y lo validamos
        if (!inputPriceUI.checkValidity()) {
            setCustomErrorMsg(inputPriceUI);
        }
        this.view.renderInputError(inputPriceUI);
    }
    
    _checkInputUnits() {
        const inputUnitsUI = document.getElementById('newprod-units');
        // Le quitamos el error personalizado que pudiera tener de una validación anterior
        inputUnitsUI.setCustomValidity('');
        // Y lo validamos
        if (!inputUnitsUI.checkValidity()) {
            setCustomErrorMsg(inputUnitsUI);
        }
        this.view.renderInputError(inputUnitsUI);
    }
    
    _checkInputName() {
        const inputNameUI = document.getElementById('newprod-name');
        // Le quitamos el error personalizado que pudiera tener de una validación anterior
        inputNameUI.setCustomValidity('');
        // Y lo validamos
        if (!inputNameUI.checkValidity()) {
            setCustomErrorMsg(inputNameUI);
        } else {
            // El nombre es válido, vamos a ver si está repetido (y no es este, para lo que cogemos su id)
            const formId = Number(document.getElementById('newprod-id').value);
            if (this.store.products.find(product => product.name === inputNameUI.value && product.id !== formId)) {
                // Le ponemos un error personalizado
                inputNameUI.setCustomValidity('Ya existe un producto con ese nombre');
            }
        }
        this.view.renderInputError(inputNameUI);
    }
    
    _setProductListeners(product) {
        // Ponemos los listeners para los 4 botones que se han creado
        const btnIncrease = document.querySelector('#prod-' + product.id + ' .increase');
        btnIncrease.addEventListener('click', () => {
            this.changeProductStock(product.id, 1);            
        })

        const btnDecrease = document.querySelector('#prod-' + product.id + ' .decrease');
        btnDecrease.addEventListener('click', () => {
            this.changeProductStock(product.id, -1);            
        })

        const btnEdit = document.querySelector('#prod-' + product.id + ' .edit');
        btnEdit.addEventListener('click', () => {
            this.view.renderEditForm(product);            
        })

        const btnDelete = document.querySelector('#prod-' + product.id + ' .delete');
        btnDelete.addEventListener('click', () => {
            this.deleteProductFromStore(product.id);
        })
    }

    addProductToStore(formData) {
        // No comprobamos que los datos sean correctos porque lo hace la clase Store.

        try {
            this.store.addProduct(formData, 
                this.view.renderNewProduct, this._setProductListeners.bind(this));
        } catch (err) {
            this.view.renderErrorMessage(err);
            return;
        }
        this.view.renderStoreImport(this.store.totalImport());
        this.view.renderAddForm(); 
    }

    deleteProductFromStore(prodId) {
        // Debemos obtener el producto para pedir confirmación
        let product = this.store.findProduct(Number(prodId));
        if (!product) {
            this.view.renderErrorMessage('No hay ningún producto con id ' + prodId);
            return;
        }

        if (confirm(`Deseas borrar el producto "${product.name}" con id ${product.id}?`)) {
            if (product.units) {
                // Si tiene unidades hay que pedir una segunda confirmación
                if (confirm(`Ese producto aún tiene ${product.units} uds. que desaparecerán. Deseas continuar?`)) {
                    // Eliminamos sus unidades
                    try {
                        product = this.store.changeProductUnits({
                            id: product.id,
                            units: -product.units
                        });
                    } catch (err) {
                        this.view.renderErrorMessage(err);
                        return;
                    }
                } else {
                    return;     // No se hace nada
                }
            }            

            try {
                this.store.delProduct(Number(prodId));
            } catch (err) {
                this.view.renderErrorMessage(err);
                return;
            }

            this.view.renderDelProduct(prodId);
            this.view.renderStoreImport(this.store.totalImport());
        }
    }

    changeProductInStore(formData) {
        try {
            var prodModified = this.store.changeProduct(formData);
        } catch (err) {
            this.view.renderErrorMessage(err);
            return;
        }
        this.view.renderEditProduct(prodModified);
        this._setProductListeners(prodModified);
        this.view.renderStoreImport(this.store.totalImport());
        this.view.renderAddForm();
    }

    changeProductStock(prodId, unitsToIncrease) {
        try {
            var product = this.store.changeProductUnits({
                id: Number(prodId),
                units: Number(unitsToIncrease)
            })
        } catch (err) {
            this.view.renderErrorMessage(err);
            return;
        }
        this.view.renderChangeStock(product);
        // Como no borro los botones conservan sus listeners
        this.view.renderStoreImport(this.store.totalImport());
    }
}

function setCustomErrorMsg(input) {
    // Personalizamos el msg de error
    if (input.validity.valueMissing) {
        input.setCustomValidity('El campo es obligatorio');
        return;
    }
    if (input.validity.typeMismatch) {
        input.setCustomValidity('El valor debe ser de tipo ' + input.type);
        return;
    }
    if (input.validity.tooShort) {
        input.setCustomValidity('Debe contener al menos ' + input.minLength + ' caracteres');
        return;
    }
    if (input.validity.tooShort) {
        input.setCustomValidity('No puede tener más de ' + input.maxLength + ' caracteres');
        return;
    }
    if (input.validity.rangeUnderflow) {
        input.setCustomValidity('El valor debe ser ' + input.min + ' o superior');
        return;
    }
    if (input.validity.rangeUnderflow) {
        input.setCustomValidity('El valor debe ser ' + input.max + ' o inferior');
        return;
    }
}

module.exports = Controller;
