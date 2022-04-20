const express = require('express');
const bodyParser = require('body-parser')
const fs = require('fs')
const app = express();

const url = require('./views/url')


function makeid(length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * 
 charactersLength));
   }
   return result;
}

app.use(express.static(__dirname + '/views'));
app.set('view engine', 'ejs');


app.use('/:url', url);


app.get('/', (req, res) =>{
    res.sendFile('/views/main.html', {root: __dirname})
})

app.post('/createPOST', bodyParser.urlencoded({extended: false}), (req, res)=>{
    try{
        if(!req.body.data && !req.body.author) return;

        var Data = req.body.data;
        var Index = Data.replace(/(?:\r\n|\r|\n)/g, '<:NEWLINE:>');

        let newUrl = makeid(7);
        
        let newData = {url: newUrl, text: Index, author: req.body.author};
        fs.readFile('views/urls/urls.json', function (err, data) {
            obj = JSON.parse(data);

            obj.urls.push(newData);

            fs.writeFile('views/urls/urls.json', JSON.stringify(obj), function(err){
                if(err) throw err;
                console.log("new data \n" + newData);
            })
        })

        res.send("/"+newUrl);
    }
    catch(err){
        return res.status(500).send(err);
    }
})



app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ 
  extended: true
})); 
app.use(express.json());
app.use(express.urlencoded());

var PORT = process.env.PORT || 3030;

app.listen(PORT, () => console.log("server working."));