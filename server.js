const yaml = require('js-yaml');
const fs   = require('fs');
const cred = yaml.safeLoad(fs.readFileSync('./ref/credential.yml', 'utf8'));


const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = process.env.PORT || 5000;
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


const MongoClient = require('mongodb').MongoClient;
const uri = cred.MangoAtlas.uri;
const client = new MongoClient(uri, { useNewUrlParser: true });
async function postCompare() {
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


app.get('/api/hello', (req, res) => {
  res.send({ express: 'Hello From Express' });

  postCompare();
});

app.post('/api/world', (req, res) => {
  console.log(req.body)
  res.send(
    `I received your POST request. This is what you sent me: ${req.body}`,
  );
});


app.listen(port, () => console.log(`Listening on port ${port}`));
