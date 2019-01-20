const axios = require('axios');
const expect = require ('chai').expect;
const httpStatus = require ('http-status-codes');

const REQUEST_HEADER = { headers: {"Content-Type":"application/json"}};

const getResponse = async (path, verb='get', data=null )=> {
    try{
        return await axios[verb](`http://localhost/${path}`, data, REQUEST_HEADER);
    }
    catch (e) {
        if (e && e.response) {
            return e.response;
        }
        else {
            throw e;
        }
    }
}

describe('GET all products', () => {
    let response;

    before(async () => {
        response = await getResponse('products');
    });
  
    it('OK status expected', () =>
        expect(response.status).to.be.equal(httpStatus.OK)
    );

    it('Body should be an object', () =>
        expect(response.data).to.be.a('object')
    );

    it('Object should have 3 elements', () =>
        expect(Object.keys(response.data).length).to.be.equal(3)
    )

    it('Verify inventory', () => {
        expect(response.data[1].inventory_count).to.be.equal(0);
        expect(response.data[2].inventory_count).to.be.equal(4);
        expect(response.data[3].inventory_count).to.be.equal(8);
    })
});

describe('GET all available products', () => {
    let response;

    before(async () => {
        response = await getResponse('products?available=true');
    });
  
    it('OK status expected', () =>
        expect(response.status).to.be.equal(httpStatus.OK)
    );

    it('Body should be an object', () =>
        expect(response.data).to.be.a('object')
    );

    it('Object should have 2 elements', () =>
        expect(Object.keys(response.data).length).to.be.equal(2)
    )

    it('Verify inventory', () => {
        expect(response.data[2].inventory_count).to.be.equal(4);
        expect(response.data[3].inventory_count).to.be.equal(8);
    })
});

describe('GET valid product', () => {
    let response;

    before(async () => {
        response = await getResponse('products/1');
    });
  
    it('OK status expected', () =>
        expect(response.status).to.be.equal(httpStatus.OK)
    );

    it('Body should be an object', () =>
        expect(response.data).to.be.a('object')
    );

    it('Object should have 3 sttributes', () =>
        expect(Object.keys(response.data).length).to.be.equal(3)
    )

    it('Verify product attributes', () => {
        expect(response.data).to.have.property('title');
        expect(response.data).to.have.property('price');
        expect(response.data).to.have.property('inventory_count');
    })
});

describe('GET invalid product', () => {
    let response;

    before(async () => {
        response = await getResponse('products/0');
    });
  
    it('404 status expected', () =>
        expect(response.status).to.be.equal(httpStatus.NOT_FOUND)
    );
});

describe('Purchase a valid product', () => {
    let response, originalInventoryCount, newInventoryCount;

    before(async () => {
        response = await getResponse('products/2');
        originalInventoryCount = response.data.inventory_count;
        response = await getResponse('products/2', 'put', {'action': 'purchase' });
        newInventoryCount = response.data.inventory_count;
    });
  
    it('OK status expected', () =>
        expect(response.status).to.be.equal(httpStatus.OK)
    );

    it('Body should be an object', () =>
        expect(response.data).to.be.a('object')
    );

    it('Object should have 3 sttributes', () =>
        expect(Object.keys(response.data).length).to.be.equal(3)
    )

    it('Verify inventory count', () => {
        expect(response.data.inventory_count).to.equal(originalInventoryCount-1);
    })
});

describe('Purchase an invalid product', () => {
    let response;

    before(async () => {
        response = await getResponse('products/p', 'put', {'action': 'purchase' });
    });
  
    it('404 status expected', () =>
        expect(response.status).to.be.equal(httpStatus.NOT_FOUND)
    );
});

describe('Purchase a product with no inventory', () => {
    let response, originalInventoryCount;

    before(async () => {
        response = await getResponse('products/1');
        originalInventoryCount = response.data.inventory_count;
        response = await getResponse('products/1', 'put', {'action': 'purchase' });
    });

    it('empty inventory expected', () =>
        expect(originalInventoryCount).to.be.equal(0)
    );
  
    it('400 status expected', () =>
        expect(response.status).to.be.equal(httpStatus.BAD_REQUEST)
    );
});