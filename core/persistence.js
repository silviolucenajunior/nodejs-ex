"use strict"
/**
 * This file contains all persistence logic
 */
var url = 'mongodb://172.30.217.224:27017/application';
var database = null;
var MongoClient = require('mongodb').MongoClient;
var database = null;

function deleteDocument (meta, _id) {
    return database.collection(meta['ModelName']).remove({_id: _id});
}

function init(mongoURL) {
    console.log("Connecting on " + mongoURL)
    MongoClient.connect(mongoURL || url)
    .then(db => {
        database = db;
    })
    .catch(err => {
        console.log("Error on connecting to mongo");
        console.log(url)
        console.log(err);
    });
}
/**
 * @param meta MetaData of document
 * @param document Document to be inserted on database
 */
function insert (meta, document) {
    return database.collection(meta['ModelName']).save(document);
}

function findAll(meta) {
    return database.collection(meta['ModelName']).find({}).toArray();
}

function find(meta, query) {
    console.log(query);
    console.log(database.collection(meta['ModelName']).findOne(query));
    return database.collection(meta['ModelName']).findOne(query);
}

function search(meta, fields, keyword) {
    var query = {};
    var orClause = []
    for (let field in fields) {
        query = {};
        query[fields[field]] = {'$regex': '^' + keyword, '$options': 'i'};
        orClause.push(query)
    }
    console.log("Search Query parsed");
    console.log(query);
    return database.collection(meta['ModelName']).find({'$or': orClause}).toArray();
}

module.exports = {
    delete: deleteDocument,
    init: init,
    insert: insert,
    find: find,
    findAll: findAll,
    search: search
}