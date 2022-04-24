const express = require('express');
const bodyParser = require('body-parser')
const mongoose = require('mongoose');
const {MongoClient} = require('mongodb');
const fs = require('fs')
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


app.post('/createPOST', bodyParser.urlencoded({extended: false}), (req, res)=>{
    try{
        if(!req.body.data && !req.body.author) return;

        var Data = req.body.data;
        var Index = Data.replace(/(?:\r\n|\r|\n)/g, '<:NEWLINE:>');

        let newUrl = makeid(7);
        
        let newData = {url: newUrl, text: Index, author: req.body.author};

        var UrlSchema = mongoose.Schema({
            url: String,
            data: String,
            author: String
          }, {collection: 'urls'});
       
          var Url = mongoose.model('URL', UrlSchema, 'urls');
       
          var url1 = new Url({ url: newUrl, data: Index, author: req.body.author});
       
          url1.save(function (err, url) {
            if (err) return console.error(err);
            console.log(url.url + " saved to urls collection.");
          });

        res.send("/"+newUrl);
    }
    catch(err){
        return res.status(500).send(err);
    }
})

client.connect((err)=>{
  app.get('/:url', (req, res)=>{
    try{
      var url = JSON.stringify(req.params.url);
      let found = false;
      let foundNum;


      db.collection("urls").findOne({}, function(err, result){
        if(err) throw err;
        console.log(result);
        if(result){
          res.send(result.data +' '+ result.author);
        }
        else{
          res.send("i think you nob!")
        }
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