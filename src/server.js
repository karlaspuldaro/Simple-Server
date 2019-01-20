/*
SIMPLE ONLINE STORE SERVER
This is a server side web api that can be used to fetch all products as well as one at a time.
Products can be purchased, one at a time.
*/

const express = require('express');
const app = express();
const port = 80;
const bodyParser = require('body-parser');
const httpStatus = require ('http-status-codes');

//json object containing a list of all products. Ideally this would be in a proper database.
const products = {
    1: {title: 'cat_food_kitten', price: 2, inventory_count: 0},
    2: {title: 'cat_food_original', price: 1.5, inventory_count: 4},
    3: {title: 'cat_food_senior', price: 2.6, inventory_count: 8}
};

// create a set of available product keys only, in order to fetch products that can be purchased more efficiently
const availableProductKeys = new Set();
for (let key in products) {
    if (products[key].inventory_count > 0){
        availableProductKeys.add(key);
    }          
}

app.use(bodyParser.json());

app.use((req,res,next ) => {
	console.log(req.method + ' request for ' + req.url)
	next();
});

app.get('/', (req, res) => res.send('Welcome to Cat Foodies! =^..^='));

app.listen(port, () => console.log(`App is listening on port ${port}!`));

app.get('/products', (req, res) => {
    const prods = fetchProducts(req.query && req.query.available === 'true');
    res.json(prods);
});

app.get('/products/:id', (req, res) => {
    const id = req.params.id;
    const prod = fetchProductById(id);
    prod ? res.json(prod) : res.status(httpStatus.NOT_FOUND).json({error: 'product not found'});
});

app.put('/products/:id', (req, res) => {
    const id = req.params.id;
    let prod = fetchProductById(id);
    if (prod && req.body && req.body.action === 'purchase') {
        if (prod.inventory_count === 0) {
            res.status(httpStatus.BAD_REQUEST).json({error: 'product cannot be purchased'});

        } else {
            res.json(purchaseProduct(id));
        }
    }
    else {
        res.status(httpStatus.NOT_FOUND).json({error: 'product not found'});
    }
});

const fetchProducts = available => {
    console.log('fetching products...');
    
    if (available){
        let availableProds = {};
        
        for (let key of availableProductKeys) {
            availableProds[key] = products[key];       
        };
        return availableProds;
    }
    return products;
};

const fetchProductById = (id) => {
    console.log('fetching product ' + id + ': ' + JSON.stringify(products[id]));
    return products[id];
};

const purchaseProduct = (id) => {
    console.log('purchasing product ');
    
    products[id].inventory_count --;

    if (products[id].inventory_count == 0) {
        availableProductKeys.delete(id);
    }

    return products[id];
};