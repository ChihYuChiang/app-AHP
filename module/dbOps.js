const yaml = require('js-yaml');
const fs   = require('fs');
const cred = yaml.safeLoad(fs.readFileSync('./ref/credential.yml', 'utf8'));
const MongoClient = require('mongodb').MongoClient;


const uri = cred.MangoAtlas.uri;
const client = new MongoClient(uri, { useNewUrlParser: true });

exports.postCompare = async function () {
  try {
    await client.connect();
    console.log("Connected correctly to server");
    const collection = client.db("app").collection("test"); //ahp

    //Insert a single document
    let res = await collection.insertOne({a:1});
    console.log(res.insertedCount)
    console.log(res.insertedId)

    //Close connection
    client.close();
  } catch(err) {
    console.log(err.stack);
  }
}