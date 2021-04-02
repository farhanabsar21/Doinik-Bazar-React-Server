const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();
const port = process.env.PORT || 5000;
const MongoClient = require('mongodb').MongoClient;
const uri = 
`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ihxuz.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


app.use(cors());
app.use(bodyParser.json());

client.connect(err => {
  const collection = client.db("doinikbazar").collection("products");
  const orders = client.db("doinikbazar").collection("orders");
  const adminData = client.db("doinikbazar").collection("adminData");
  const adminOrders = client.db("doinikbazar").collection("adminOrder");

  app.get("/allProducts", (req, res)=>{
      collection.find({})
      .toArray((err, docs) => {
          res.send(docs)
      })
  })
  
  // load a single product
  app.get("/products/:key", (req, res)=>{
    collection.find({key: req.params.key})
      .toArray((err, docs) => {
          res.send(docs[0]);
      })
  })


  app.post("/selectedProducts", (req, res)=>{
      const selectedItem = req.body;
      orders.insertMany(selectedItem)
        .then(result => {
            res.send(result);
        })
  })
  
  // I'm sorry this didn't work 
  // this query sending me email but products were not set to the order page
  // so I kept the order global 

  // app.get("/selectedProducts", (req, res) =>{
  //   console.log(req.query.email);
  //   orders.find({email: req.query.email})
  //   .toArray((err, docs) => {
  //       res.send(docs)
  //   })
  // })

  app.get("/selectedProducts", (req, res) =>{
    orders.find({})
    .toArray((err, docs) => {
        res.send(docs)
    })
  })

  app.delete("/delete/:id", (req, res) => {
    adminData.deleteOne(req.params.key)
      .then(doc => {
        res.send(doc.deletedCount > 0);
      })
  })

  app.post("/adminAddProduct", (req, res)=>{
    const adminProduct = req.body;
    adminOrders.insertOne(adminProduct)
    .then(result => {
      res.send(result);
    })
  })

  app.get("/adminAddProduct", (req, res)=>{
    adminOrders.find({})
      .toArray((err, docs)=>{
        res.send(docs)
      })
  })

  app.get("/adminProducts", (req, res) =>{
    adminData.find({})
    .toArray((err, docs) => {
        res.send(docs)
    })
  })
});



app.get('/', (req, res) => {
  res.send('Hi, welcome to DoinikBazar Backend!')
})

app.listen(port, () => {
  console.log("server is running")
})
