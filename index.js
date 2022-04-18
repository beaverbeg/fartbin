const express = require('express');
const bodyParser = require('body-parser')
const app = express();

const url = require('./views/url')

app.use(express.static(__dirname + '/views'));
app.set('view engine', 'ejs');


app.use('/:url', url);


app.get('/', (req, res) =>{
    res.sendFile('/views/main.html', {root: __dirname})
})

app.post('/createPOST', bodyParser.urlencoded({extended: false}), (req, res)=>{
    try{
        if(!req.body.data && !req.body.author) return;

        var y = req.body.data;
        var f = y.replace(/(?:\r\n|\r|\n)/g, '<br>');

        console.log(f);

        res.send(f + "<br><br> ~" + req.body.author);
    }
    catch(err){
        console.log(err);
        return res.status(500).send("server error");
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