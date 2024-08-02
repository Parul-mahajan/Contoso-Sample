/* eslint-disable no-undef */
import chai from 'chai';
import sinon from 'sinon';
import { CosmosClient } from '@azure/cosmos';
import 'dotenv/config';

const { expect } = chai;

describe('itemsFunction', () => {
  // eslint-disable-next-line no-unused-vars
  let context, req, clientStub, databaseStub, containerStub, itemStub;
  let itemsFunction;

  before(async () => {
    itemsFunction = (await import('file:///C:/Users/parulmahajan/OneDrive%20-%20Microsoft/Copilot/react-swa-full-stack-app/api/Items/index.js')).default;
  });

  it('should run a basic test', () => {
    expect(true).to.be.true;
  });

  beforeEach(() => {
    context = { log: sinon.stub(), res: {} };
    req = { method: '', params: {}, body: {} };

    itemStub = {
      read: sinon.stub(),
      replace: sinon.stub(),
      delete: sinon.stub(),
      create: sinon.stub()

    };
    containerStub = {
      item: sinon.stub().returns(itemStub)
    };
    databaseStub = {
      container: sinon.stub().returns(containerStub)
    };
    clientStub = {
      database: sinon.stub().returns(databaseStub)
    };

    sinon.stub(CosmosClient.prototype, 'database').returns(databaseStub);
  });

  afterEach(() => {
    sinon.restore();
  });

  it('should return all items when the request method is GET without id', async () => {
    req.method = 'GET';
    const items = [{ id: '123', name: 'Item 1' }, { id: '124', name: 'Item 2' }];
    containerStub.items = {
      readAll: sinon.stub().returns({
        fetchAll: sinon.stub().resolves({ resources: items })
      })
    };
    await itemsFunction(context, req);
    expect(context.res.status).to.equal(200);
    expect(context.res.body).to.deep.equal(items);
  });

  it('should return 500 when there is an error retrieving all items', async () => {
    req.method = 'GET';
    containerStub.items = {
      readAll: sinon.stub().returns({
        fetchAll: sinon.stub().rejects(new Error('Database error'))
      })
    };
    await itemsFunction(context, req);
    expect(context.res.status).to.equal(500);
    expect(context.res.body).to.equal('Error retrieving items from the database: Database error');
  });

  it('should return 500 when there is an error retrieving a single item', async () => {
    req.method = 'GET';
    req.params.id = '123';
    itemStub.read.rejects(new Error('Database error'));
    await itemsFunction(context, req);
    expect(context.res.status).to.equal(500);
    expect(context.res.body).to.equal('Error retrieving item from the database: Database error');
  });



  it('should return 500 when there is an error updating an item', async () => {
    req.method = 'PUT';
    req.params.id = '123';
    req.body = { name: 'Updated Item' };
    itemStub.replace.rejects(new Error('Database error'));
    await itemsFunction(context, req);
    expect(context.res.status).to.equal(500);
    expect(context.res.body).to.equal('Error updating item in the database: Database error');
  });

  it('should return 500 when there is an error deleting an item', async () => {
    req.method = 'DELETE';
    req.params.id = '123';
    itemStub.delete.rejects(new Error('Database error'));
    await itemsFunction(context, req);
    expect(context.res.status).to.equal(500);
    expect(context.res.body).to.equal('Error deleting item from the database: Database error');
  });

  it('should return 405 when the request method is not supported', async () => {
    req.method = 'PATCH';
    await itemsFunction(context, req);
    expect(context.res.status).to.equal(405);
    expect(context.res.body).to.equal('Method Not Allowed');
  });
});