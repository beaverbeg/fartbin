const express = require('express');
const bodyParser = require('body-parser')
const mongoose = require('mongoose');
const {MongoClient} = require('mongodb');
const fs = require('fs');
const app = express();

const url = 'mongodb+srv://beaverbeg:Fp26ehds01DqF7iq@cluster0.gz12m.mongodb.net/myFirstDatabase?retryWrites=true&w=majority';

mongoose.connect(url);

const client = new MongoClient(url);

var db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));

db.once('open', function() {
    console.log("Connection Successful!");
});

app.use(express.static(__dirname + '/views'));
app.set('view engine', 'ejs');

app.get('/', bodyParser.urlencoded({extended: false}),  (req, res) =>{
    res.sendFile('/views/main.html', {root: __dirname})
})

client.connect((err)=>{
  var dbo = client.db("myFirstDatabase");
  
app.post('/createPOST', bodyParser.urlencoded({extended: false}), (req, res)=>{
    try{
        if(!req.body.data && !req.body.author) return;

        var Data = req.body.data;
        var Index = Data.replace(/(?:\r\n|\r|\n)/g, '<:NEWLINE:>');

        let newUrl = makeid(7);
        
        let newData = {url: newUrl, text: Index, author: req.body.author};

        dbo.collection("urls").insertOne(newData, function(err, res){
          if(err) throw err;
          console.log("data should be in collection bruh")
          db.close();
        })

        res.send("/"+newUrl);
    }
    catch(err){
        return res.status(500).send(err);
    }
})

  app.get('/:url', (req, res)=>{
    try{
      var url = JSON.stringify(req.params.url);
      let found = false;
      let foundNum;

      dbo.collection("urls").find({}).toArray(function(err, result){
        if(err) throw err;
        let found = false;

        console.log("result lenght is: "+result.length)
        console.log(result[0]);
        console.log("im between!")
        console.log(result[1]);
        res.send("check console")
        db.close();
      })
    }

  catch(err){
      console.error(err);
      return res.status(500).send("Server error");
  }
  });
})


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ 
  extended: true
})); 
app.use(express.json());
app.use(express.urlencoded());


function makeid(length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
   }
   return result;
}


var PORT = process.env.PORT || 3030;

app.listen(PORT, () => console.log("server working."));