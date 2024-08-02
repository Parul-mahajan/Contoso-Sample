else if (req.method === "PUT") {
    try {
        const itemId = req.params.id;
        const updatedItem = req.body;
        const { resource: replacedItem } = await container.item(itemId, itemId).replace(updatedItem);
        context.res = {
            status: 200,
            body: replacedItem
        };
    } catch (error) {
        context.res = {
            status: 500,
            body: `Error updating item in the database: ${error.message}`
        };
    }