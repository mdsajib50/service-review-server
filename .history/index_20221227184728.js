const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
require('dotenv').config();
const port = process.env.PORT || 5000;

// middel wares

app.use(cors())
app.use(express.json())


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.bx3l1s2.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        const serviceCollection = client.db("servicedb").collection("services");
        const reviewCollection = client.db("servicedb").collection("reviews");

        app.post('/jwt', (req, res)=>{
          const user =req.
        })
        app.get('/services', async(req, res)=>{
            const query = {}
            const cursor = serviceCollection.find(query)
            const services = await cursor.limit(3).toArray();
            
            res.send(services)
         });
        app.get('/service', async(req, res)=>{
            const query = {}
            const cursor = serviceCollection.find(query)
            const services = await cursor.toArray();
            
            res.send(services)
         });
         app.get('/service/:id', async(req, res)=>{
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const service = await serviceCollection.findOne(query);
            res.send(service)
          })
        //   reviews api
        app.get('/reviews', async(req, res)=>{
            const query ={};
            const cursor = reviewCollection.find(query)
            const reviews = await cursor.toArray()
            res.send(reviews)
         })
         app.get('/reviews', async(req, res)=>{
    
            let query ={};
            if (req.query.email) {
              query = {
                email: req.query.email
              }
            }
            
            const cursor = reviewCollection.find(query);
            const review = await cursor.toArray()
            console.log(review)
            res.send(review)
        })
        app.post('/reviews', async(req, res)=>{
            const review = req.body;
            const result = await reviewCollection.insertOne(review);
            res.send(result)
         })
         app.delete('/reviews/:id', async(req, res)=>{
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const result = await reviewCollection.deleteOne(query);
            console.log(result)
            res.send(result)
         })

    } finally {
        
    }
}

run().catch(err => console.log(err))

app.get('/', (req, res)=>{
    res.send('Service review site is running')
});

app.listen(port, ()=>{
    console.log(`Server is running on ${port}`)
})