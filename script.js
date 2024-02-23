// Get the UI elements

let productList = document.querySelector('#product-list');
let cartList = document.querySelector('#cart-list');


// Book Class
class Product{
    constructor(code,product,price){
        this.code=code;
        this.product=product;
        this.price=price;
        this.qty=1;
        this.totalPrice=this.price * this.qty;
    }

}

// UI Class

class UI{

    static addNewProductToCart(product){
        let row = document.createElement('tr');
        row.innerHTML = `
        <td>${product.code}</td>
        <td>${product.product}</td>
        <td>${product.price}</td>
        <td><a href = '#' class="increase">(+)</a>
        ${product.qty}
        <a href = '#' class="decrease">(-)</a></td>
        <td>${product.totalPrice}</td>
        <td><a href = '#' class="remove">remove</a></td>`;
        cartList.appendChild(row);
        
    }
    static clearCart(){
        while(cartList.firstChild){
            cartList.firstChild.remove();
        }
    }

 
    static showAlert(message,className){
        if(document.querySelector('.alert'))
        {
            document.querySelector('.alert').remove();
        }
        let div = document.createElement('div');
        div.className = `alert ${className}`;
        div.appendChild(document.createTextNode(message));
        let msg = document.querySelector('#message');
        let table = document.querySelector('#table');
        msg.insertBefore(div,table);

         setTimeout(() => {
            if(document.querySelector('.alert'))
            {
                document.querySelector('.alert').remove();
            }
         }, 3000);
    }

    static actionOnCart(target){
        if(target.hasAttribute('href') && target.className=='remove'){
            target.parentElement.parentElement.remove();
            Store.removeProductFromStore(target.parentElement.parentElement.firstElementChild.textContent.trim());                    
            this.showAlert('Product removed successfully!', 'success');
        }
        else if(target.hasAttribute('href') && target.className=='increase'){
            Store.productIncrease(target.parentElement.parentElement.firstElementChild.textContent.trim());       
            this.showAlert('Product increased successfully!', 'success');
        }

        else if(target.hasAttribute('href') && target.className=='decrease'){
            Store.productDecrease(target.parentElement.parentElement.firstElementChild.textContent.trim());       
            
        }
    }
}

// Local Storage Class

class Store{
    static getProducts(){
        let products;
        if(localStorage.getItem('products')===null){
            products = [];
        }
        else{
            products = JSON.parse(localStorage.getItem('products'));
        }
        return products;
    }

    static addProductToStore(product){

        let products = this.getProducts();
        products.push(product);
        localStorage.setItem('products',JSON.stringify(products));
    }

    static displayProducts(){
        let products = this.getProducts();
        products.forEach(product => {
            UI.addNewProductToCart(product);

        });
    }

    static checkProductExist(product){
        let products = this.getProducts();
        let check=false;
        products.forEach(prd=>{
            if(prd.code===product.code){
                check=true;
                
            }
        });
        return check;
    }
    static productIncrease(code){
        let products = this.getProducts();
        products.forEach(prd=>{
            if(prd.code===code){   
                prd.qty = prd.qty + 1;
                prd.totalPrice = prd.price * prd.qty;
            }
        });
        localStorage.setItem('products',JSON.stringify(products))
        UI.clearCart();
        this.displayProducts();

    }

    static productDecrease(code){
        let products = this.getProducts();
        let removeFlag=false;
        products.forEach(prd=>{
            if(prd.code===code && prd.qty>1){   
                prd.qty = prd.qty - 1;
                prd.totalPrice = prd.price * prd.qty;
            }
            else if (prd.code===code && prd.qty==1){
                removeFlag=true;                
            }
        });

        if(removeFlag){
            this.removeProductFromStore(code);
            UI.showAlert('Product removed successfully!', 'success');

        }
        else{
            localStorage.setItem('products',JSON.stringify(products));
            UI.showAlert('Product decreased successfully!', 'success');
        
        }
        UI.clearCart();
        this.displayProducts();

    }

    static removeProductFromStore(code){
        let products = this.getProducts();
        products.forEach((product,index) => {
            if(product.code === code){
                products.splice(index,1);
            }
        });
        localStorage.setItem('products',JSON.stringify(products))

    }
}


// Add Event Listener

productList.addEventListener('click',addToCart);
document.addEventListener('DOMContentLoaded',Store.displayProducts());
cartList.addEventListener('click',clickOnCart);

// Define Function

function addToCart(e){

    if(e.target.hasAttribute('href')){
        let price = e.target.parentElement.previousElementSibling.textContent;
        let prd = e.target.parentElement.previousElementSibling.previousElementSibling.textContent;
        let code = e.target.parentElement.previousElementSibling.previousElementSibling.previousElementSibling.textContent;
        let product = new Product(code,prd,price);
        let productExist = false;
        productExist = Store.checkProductExist(product);
        if(productExist){
            Store.productIncrease(product.code);
        }
        else{
            UI.addNewProductToCart(product);
            Store.addProductToStore(product);
        }
        UI.showAlert('Product added successfully!', 'success');
        
    }

    
    e.preventDefault();
}


function clickOnCart(e){
    UI.actionOnCart(e.target);
    e.preventDefault();
}


