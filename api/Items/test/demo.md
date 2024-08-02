it('should return single item for GET with id', async () => {
    req.method = 'GET';
    req.params.id = 'item1';
    itemStub.read.resolves({ resource: { id: 'item1', title: 'Sample Item', price: 29.99 } });

    await itemsFunction(context, req);

    expect(context.res.status).to.equal(200);
    expect(context.res.body).to.deep.equal({ id: 'item1', title: 'Sample Item', price: 29.99 });
  });

  it('should return all items for GET without id', async () => {

    req.method = 'GET';
    containerStub.items = {
      readAll: sinon.stub().returns({
        fetchAll: sinon.stub().resolves({ resources: [{ id: 'item1', title: 'Sample Item', price: 29.99 }] })
      })
    };

    await itemsFunction(context, req);

    expect(context.res.status).to.equal(200);
    expect(context.res.body).to.deep.equal([{ id: 'item1', title: 'Sample Item', price: 29.99 }]);
  });

  it('should update an item for PUT', async () => {
    req.method = 'PUT';
    req.params.id = 'item1';
    req.body = { id: 'item1', title: 'Updated Item', price: 39.99 };
    itemStub.replace.resolves({ resource: req.body });

    await itemsFunction(context, req);

    expect(context.res.status).to.equal(200);
    expect(context.res.body).to.deep.equal(req.body);
  });

  it('should delete an item for DELETE', async () => {
    req.method = 'DELETE';
    req.params.id = 'item1';

    await itemsFunction(context, req);

    expect(context.res.status).to.equal(204);
  });

  it('should return 405 for unsupported methods', async () => {
    req.method = 'PATCH';

    await itemsFunction(context, req);

    expect(context.res.status).to.equal(405);
    expect(context.res.body).to.equal('Method Not Allowed');
  });



try {
            const newItem = req.body;
            const { resource: createdItem } = await container.items.create(newItem);
            context.res = {
                status: 201,
                body: createdItem
            };
        } catch (error) {

            context.res = {
                status: 500,
                body: `Error creating item in the database: ${error.message}`
            };
        }