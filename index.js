const express = require('express')
require("dotenv").config();
const MongoClient = require("mongodb").MongoClient;
const bodyParser = require('body-parser');
const cors = require('cors');

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.pv2hb.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;


const app = express()
app.use(bodyParser.json())
app.use(cors())
const port = 5000

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
client.connect((err) => {
  const ProductsCollection = client.db("emaJohnStore").collection("products");
  const ordersCollection = client.db("emaJohnStore").collection("orders");
  
  app.post('/addProducts', (req, res)=>{
      const product = req.body;
      ProductsCollection.insertMany(product)
      .then(result=>{
          res.send(result.insertedCount)
      })
  })

  app.get('/products', (req, res)=>{
      ProductsCollection.find({})
      .toArray((err, documents)=>{
          res.send(documents)
      })
  })

  app.get('/product/:key', (req, res)=>{
      ProductsCollection.find({key: req.params.key})
      .toArray((err, documents)=>{
          res.send(documents[0])
      })
  })

  app.post('/productsByKeys', (req, res) => {
      const productKeys = req.body;
      ProductsCollection.find({key: {$in: productKeys}})
           .toArray((err, documents) => {
               res.send(documents)
           })
  })

  app.post('/AddOrder', (req, res) => {
      const order = req.body;
      ordersCollection.insertOne(order)
          .then(result => {
              res.send(result.insertedCount > 0)
          })
  })

});


app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(process.env.PORT || port)