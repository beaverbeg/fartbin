const express = require('express');
const bodyParser = require('body-parser')
const mongoose = require('mongoose');
const {MongoClient, CommandStartedEvent} = require('mongodb');
const app = express();

//const url = process.env.TOK;
const url = "mongodb+srv://beaverbeg:Fp26ehds01DqF7iq@cluster0.gz12m.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";

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
          console.log("new data in collection")
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
        //im using this method to add variables to names
        //so i dont need to create array
        var obj = {"length": result.length};
        if(result.length<1) return res.send("There is no fartbins at the server. You can create one now!"); 
        for(var i = 0; i < result.length; i++){
          obj["title"+i] = result[i].title;
          obj["url"+i] = result[i].url;
        }
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
      var foundTitle = "";
      var foundText = "";
      var foundAuthor = "";

      dbo.collection("urls").find({}).toArray(function(err, result){
        if(err) throw err;
        if(result){
          for(var i=0; i<result.length; i++){
            if(result[i].url == url){
              found = true;
              foundText = result[i].text;
              foundAuthor = result[i].author;
              foundTitle = result[i].title;
              break;
            }
          }

          if(found==false){
            res.sendFile('/views/hc/notfound.html', {root: __dirname});
          }
          else{
            var obj = {foundText: foundText, foundAuthor: foundAuthor, foundTitle: foundTitle}
            res.render('page', {obj});
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
  extended:	false
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


const PORT = process.env.PORT || 3030;

app.listen(PORT, ()=>{
  console.log("server is lisingiign g");
})