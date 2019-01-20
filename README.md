SIMPLE ONLINE STORE SERVER

GETTING STARTED
1. Download the directory shopify-backend-challenge
2. From command line, navigate to the path above
3. To start the server, run the command: npm start
4. From your web browser, access localhost
5. To fetch all products: localhost/products
6. To fetch all available products: localhost/products?available=true
7. To fetch a product by id: localhost/products/<id>, where valid ids = 1,2,3
8. To purchase a product, use the curl command: curl -X PUT localhost/products/<id> -H "Content-Type: application/json" --data '{"action":"purchase"}' , where valid ids = 1,2,3

RUNNING TESTS