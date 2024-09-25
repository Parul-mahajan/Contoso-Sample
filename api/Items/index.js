import { CosmosClient } from '@azure/cosmos';
import dotenv from 'dotenv';

dotenv.config();

// eslint-disable-next-line no-undef
const client = new CosmosClient({ endpoint: "https://cotoso.documents.azure.com:443/", key: process.env["COSMOSDB_KEY"] });

function validateInput(item) {
    const requiredFields = ['id', 'price', 'title'];
    const missingFields = requiredFields.filter(field => !item[field]);

    if (missingFields.length > 0) {
        const errorMessage = 'Error: All fields (id, price, title) are required.';
        console.error(errorMessage, item);
        return errorMessage;
    }

    if (isNaN(item.id)) {
        const errorMessage = 'Error: The id must be a valid number.';
        console.error(errorMessage, item);
        return errorMessage;
    }

    // Edge case: Ensure price is a positive number
    if (item.price <= 0) {
        const errorMessage = 'Error: The price must be a positive number.';
        console.error(errorMessage, item);
        return errorMessage;
    }

    // Edge case: Ensure title is a non-empty string
    if (typeof item.title !== 'string' || item.title.trim() === '') {
        const errorMessage = 'Error: The title must be a non-empty string.';
        console.error(errorMessage, item);
        return errorMessage;
    }

    return null;
}
export default async function itemsFunction(context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');

    const database = client.database("SWAStore");
    const container = database.container("Items");

    if (req.method === "GET" && req.params.id) { // Return single item
        try {
            const itemId = req.params.id;
            const { resource } = await container.item(itemId, itemId).read();
            context.res = {
                status: 200,
                body: resource
            };
        } catch (error) {
            context.res = {
                status: 500,
                body: `Error retrieving item from the database: ${error.message}`
            };
        }
    } else if (req.method === "GET") { // Return all items
        try {
            const { resources } = await container.items.readAll().fetchAll();
            context.res = {
                status: 200,
                body: resources
            };
        } catch (error) {
            context.res = {
                status: 500,
                body: `Error retrieving items from the database: ${error.message}`
            };
        }
    } else if (req.method === "POST") { // Create new item in the database
        try {
            const newItem = req.body;

            // Validate input
            const validationError = validateInput(newItem);
            if (validationError) {
                context.res = {
                    status: 400,
                    body: validationError
                };
                return;
            }

            const { resource: createdItem } = await container.items.create(newItem);
            console.log('Item created:', createdItem);
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
    } else if (req.method === "PUT") { // Update item in the database
        try {
            const itemId = req.params.id;
            const updatedItem = req.body;

            // Validate input
            const validationError = validateInput(updatedItem);
            if (validationError) {
                context.res = {
                    status: 400,
                    body: validationError
                };
                return;
            }

            const { resource: replacedItem } = await container.item(itemId, itemId).replace(updatedItem);
            console.log('Item updated:', replacedItem);
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
    } else if (req.method === "DELETE") { // Delete item from the database
        try {
            const itemId = req.params.id;
            await container.item(itemId, itemId).delete();
            context.res = {
                status: 204
            };
        } catch (error) {
            context.res = {
                status: 500,
                body: `Error deleting item from the database: ${error.message}`
            };
        }
    } else {
        context.res = {
            status: 405,
            body: "Method Not Allowed"
        };
    }
}