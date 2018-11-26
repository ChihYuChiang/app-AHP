const yaml = require('js-yaml');
const fs   = require('fs');
const assert = require('assert').strict;
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;
const CRED = yaml.safeLoad(fs.readFileSync('./ref/credential.yml', 'utf8'));
const CONFIG = yaml.safeLoad(fs.readFileSync('./config.yml', 'utf8'));


const uri = CRED.MangoAtlas.uri;
const client = new MongoClient(uri, { useNewUrlParser: true });

exports.postCompare = async function(data) {
  try {
    await client.connect();
    console.log("Connected correctly to server");
    const collection = client.db(CONFIG.MongoAtlas.db).collection(CONFIG.MongoAtlas.collection);

    //Insert a single document
    let res = await collection.insertOne(data);
    assert.equal(res.insertedCount, 1);

    //Close connection
    client.close();

    return res.insertedId;
  } catch(err) {
    console.log(err.stack);
  }
}

exports.getCompare = async function(recordId) {
  try {
    await client.connect();
    console.log("Connected correctly to server");
    const collection = client.db(CONFIG.MongoAtlas.db).collection(CONFIG.MongoAtlas.collection);
    
    //Retrieve a single doc by id
    let res = await collection.findOne({ _id: new ObjectId(recordId) });
    assert.equal(res._id.toHexString(), recordId);

    //Close connection
    client.close();

    return res;
  } catch(err) {
    console.log(err.stack);
  }
}