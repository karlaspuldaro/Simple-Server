# SIMPLE ONLINE STORE SERVER

This is web service that exposes APIs to purchase and fetch products.



## GETTING STARTED

### Pre-Reqs

1. node version 9.9 or later
2. npm 6.6 or later

## Running Server
1. Download dependencies: `npm install`
2. Start server: `npm start`
3. Server will be available at port 80: `http://localhost:80`

## API

### GET /products

Fetches all available products. Optionally `?available=true` might be passed in order to only return products with available inventory.

### GET /products/<id>

Fetches the information about a single product.

### PUT /products/<id>

This is used for updating a single product. For now, it only supports decrementing the inventory by 1, by passing `{"action":"purchase"}` as the request body.

## Notes

This is still in development. Server is initialized with hardcoded products. In future, storage/database might be used to persist product changes across server instances.

## RUNNING TESTS
1. Make sure the server is running
2. Run command: `npm test`

Note: to re-run tests, server must to be restarted in order to reset original product attributes