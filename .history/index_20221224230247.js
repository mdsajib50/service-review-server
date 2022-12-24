const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
const app = express();
require('dotenv').config();
const port = process.env.PORT || 5000;

// middel wares

app.use(cors())
app.use(express.json())

// p- eJmyY9IbTwU1LzIX
// n- servicedb

const uri = `mongodb+srv://<username>:<password>@cluster0.bx3l1s2.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
client.connect(err => {
  const collection = client.db("test").collection("devices");
  // perform actions on the collection object
  client.close();
});


app.get('/', (req, res)=>{
    res.send('Service review site is running')
});

app.listen(port, ()=>{
    console.log(`Server is running on ${port}`)
})