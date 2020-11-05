class View{
    renderInputError(input) {
        input.nextElementSibling.innerHTML = input.validationMessage;
    }
    
    renderNewProduct(product) {
        const productTBodyUI = document.querySelector('#almacen tbody');	

        const productUI = document.createElement('tr');
        productUI.id = 'prod-'+product.id;
        productUI.innerHTML = _productToTr(product);

        productTBodyUI.appendChild(productUI);
    }

    renderEditProduct(product) {
        // Buscamos el producto
        const productUI = document.getElementById('prod-'+product.id);
        if (productUI) {            // Si está lo modificamos
            productUI.innerHTML = _productToTr(product);
        }
    }

    renderDelProduct(id) {
        // Miramos si ya está el producto
        const productUI = document.getElementById('prod-'+id);
        if (productUI) {
            productUI.parentElement.removeChild(productUI);
        }
    }

    renderChangeStock(product) {
        // Buscamos el producto
        const productUI = document.getElementById('prod-'+product.id);
        productUI.children[2].textContent = product.units;
        productUI.children[4].textContent = product.productImport().toFixed(2)+' €';
        // Si tiene unidades no debe estar deshabilitado el btn de reducir uds
        if (product.units) {
            productUI.querySelector('.decrease').removeAttribute('disabled');
        } else {
            productUI.querySelector('.decrease').setAttribute('disabled', 'disabled');
        }
    }

    renderStoreImport(total) {
        document.getElementById('total').innerHTML = total.toFixed(2);
    }

    renderErrorMessage(message) {
        const divMessagesUI = document.getElementById('messages');
        const newMessageUI = document.createElement('div');
        newMessageUI.className = "col-sm-12 alert alert-danger";
        newMessageUI.innerHTML = `
            <span>${message}</span>
            <button type="button" class="close" aria-label="Close">
                <span aria-hidden="true">&times;</span>
            </button>`;
        divMessagesUI.appendChild(newMessageUI);
        // Ponemos el listener del botń de cerrar el msg como debe ser
        newMessageUI.querySelector('button').addEventListener('click', () => this.parentElement.remove());
    }

    renderEditForm(product) {
        document.querySelector('#new-prod legend')
        .textContent = 'Editar producto';
        const id = document.querySelector('#newprod-id');
        id.parentElement.classList.remove('hide');
        id.value = product.id;
        document.querySelector('#newprod-name').value = product.name;
        document.querySelector('#newprod-price').value = product.price;
        const units = document.querySelector('#newprod-units');
        units.parentElement.classList.remove('hide');
        units.value = product.units;
        document.querySelector('#new-prod button[type="submit"]')
        .textContent = 'Cambiar';
    }

    renderAddForm() {
        document.querySelector('#newprod-id').value = "";
        document.querySelector('#new-prod').reset();
        document.querySelector('#new-prod legend').textContent = 'Nuevo producto';
        document.querySelector('#newprod-id').parentElement.classList.add('hide');
        document.querySelector('#newprod-units').parentElement.classList.add('hide');
        document.querySelector('#new-prod button[type="submit"]').textContent = 'Añadir';
    }
}

function _productToTr(product) {
    return `
        <td>${product.id}</td>
        <td>${product.name}</td>
        <td>${product.units}</td>
        <td>${product.price}</td>
        <td>${product.productImport().toFixed(2)} €</td>
        <td>
            <button class="btn btn-dark increase">
                <span class="material-icons">arrow_drop_up</span>
            </button>
            <button class="btn btn-dark decrease"${product.units?'':' disabled'}>
                <span class="material-icons">arrow_drop_down</span>
            </button>
            <button class="btn btn-dark edit">
                <span class="material-icons">edit</span>
            </button>
            <button class="btn btn-dark delete">
                <span class="material-icons">delete</span>
            </button>
        </td>`;
}    

module.exports = View;
