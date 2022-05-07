const express = require('express');
const bodyParser = require('body-parser')
const mongoose = require('mongoose');
const {MongoClient, CommandStartedEvent} = require('mongodb');
const fs = require('fs');
const urlencoded = require('body-parser/lib/types/urlencoded');
const app = express();

const url = 'mongodb+srv://beaverbeg:Fp26ehds01DqF7iq@cluster0.gz12m.mongodb.net/myFirstDatabase?retryWrites=true&w=majority';

mongoose.connect(url);

const client = new MongoClient(url);

var db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));

db.once('open', function() {
    console.log("Connection Successful!");
});

app.use(express.static(__dirname + '/views/'));
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
        var Title = req.body.title;
        var Author = req.body.author;
        var Index = Data.replace(/(?:\r\n|\r|\n)/g, '<:NEWLINE:>');

        let newUrl = makeid(7);
        
        let newData = {url: newUrl,title: Title, text: Index, author: Author};

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

  app.get('/search', (req, res)=>{
    try{
      dbo.collection("urls").find({}).toArray(function(err, result){
        if(err) throw err;
        //use this method to add variables to names
        var obj = {"length": result.length};
        if(result.length<1) return res.send("There is no fartbins at the server. You can create one now!"); 
        for(var i = 0; i < result.length; i++){
          console.log("i is: "+i);
          obj["title"+i] = result[i].title;
          obj["url"+i] = result[i].url;
        }
        console.log(obj);
        res.render('search', {obj});
      })
    }
    catch(err){
      console.log(err);
      return res.status(500).send("Server Error");
    }
  })

  app.get('/:url', (req, res)=>{
    try{
      var url = req.params.url;
      var found = false;
      var FoundTitle = "";
      var foundText = "";
      var foundAuthor = "";

      dbo.collection("urls").find({}).toArray(function(err, result){
        if(err) throw err;
        console.log(result);
        if(result){
          for(var i=0; i<result.length; i++){
            if(result[i].url == url){
              found = true;
              foundText = result[i].text;
              foundAuthor = result[i].author;
              FoundTitle = result[i].title;
              break;
            }
          }

          if(found==false){
            res.sendFile('/views/hc/notfound.html', {root: __dirname});
          }
          else{
            res.send(FoundTitle+":<br><br>"+foundText + "<br><br>Made by " + foundAuthor);
          }
        }
        else{
          res.send("Could not get database collection")
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
  extended: false
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