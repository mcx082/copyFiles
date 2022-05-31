const cosmos = require('@azure/cosmos');
const cosmosDbConnStr = "AccountEndpoint=https://cosmosdbmcx.documents.azure.com:443/;AccountKey=ZJsWjDm83mvnqaHLchT6tpvzqbW7B38GWoDyPDbtgwdVUygYhgXqhxbS2rgwX4qNgt5OccwYRd87LJLnbPC3Ug==";
const { CosmosClient } = cosmos;

const client = new CosmosClient(cosmosDbConnStr);
const container = client.database("copyfilesdb").container("dbcontainer1");

module.exports = container;
