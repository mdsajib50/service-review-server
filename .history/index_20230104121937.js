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

function verifyJwt(req, res, next) {
  const authHeader = req.headers.authorization;
  console.log('auth',authHeader)
  if (!authHeader) {
    return res.status(401).send({message: 'unauthorized access!'})
  }

const token = authHeader.split(' ')[1]
console.log('message', token)
jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, function(err, decoded) {
  if (err) {
    return res.status(401).send({message: 'unauthorized access!!'})
  }
  req.decoded = decoded
  next()
})
}
async function run() {
    try {
        const serviceCollection = client.db("servicedb").collection("services");
        const reviewCollection = client.db("servicedb").collection("reviews");

        app.post('/jwt', (req, res)=>{
          const user = req.body
          const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn:'7d'})
          res.send({token})
          console.log('Token:: ', token)
          console.log('User',user)
        })
        app.get('/services', async(req, res)=>{
            const query = {}
            const cursor = serviceCollection.find(query)
            const services = await cursor.limit(3).sort({$natural:-1}).toArray();
            
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
          app.post('/service', async(req, res)=>{
            const service = req.body;
            console.log(service)
            const result = await serviceCollection.insertOne(service);
            res.send(result)
         })
        //   reviews api
        app.get('/reviews', async(req, res)=>{
            const query ={};
            const cursor = reviewCollection.find(query)
            const reviews = await cursor.toArray()
            res.send(reviews)
         })
         app.get('/reviews/:id', async(req, res)=>{
          const id = req.params.id;
          const query = {_id: ObjectId(id)};
          const service = await reviewCollection.findOne(query);
          res.send(service)
        })
         app.get('/myreviews',verifyJwt, async(req, res)=>{
              const decoded = req.decoded
              console.log('Decoded',decoded)
              if (decoded.email !== req.query.email) {
               return res.status(403).send({message: 'unauthorized access!!!'})
              }
              console.log('query', req.query.email)
            let query ={};
            if (req.query.email) {
              query = {
                email: req.query.email
              }
            }
            
            const cursor = reviewCollection.find(query);
            const review = await cursor.toArray()
            console.log('Review',review)
            res.send(review)
        })
        app.post('/reviews', async(req, res)=>{
            const review = req.body;
            const result = await reviewCollection.insertOne(review);
            res.send(result)
         })
         app.patch('/review-update/:id', async(req, res)=>{
          const id = req.params.id;
          const review = req.body.reviews
          console.log('ME:',message)
          const query = { _id: ObjectId(id)};
          const updateDoc = {
            $set: {
             message: messages.message
            }
          }
          const result = await reviewCollection.updateOne(query, updateDoc);
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