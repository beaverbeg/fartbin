const express = require('express');
const fs = require('fs');
const router = express.Router({ mergeParams: true });

router.get("/", async (req, res) =>{
    try{
        var url = req.params.url;
        let found = false;
        let foundNum;

        fs.readFile('views/urls/urls.json', function (err, data) {
            let obj = JSON.parse(data);

            for(i=0; i < obj.urls.length; i++){
                if(obj.urls[i].url == url){
                    found = true;
                    foundNum = i;

                    break;
                }
            }

            if(found==true){
                var Text = obj.urls[foundNum].text;
                var Author = obj.urls[foundNum].author;
                res.send(Text + "<br><br><br>"+Author);
            }
            else{
                res.sendFile('hc/notfound.html', {root: __dirname })
            }
        })
    }

    catch(err){
        console.error(err);
        return res.status(500).send("Server error")
    }
})

module.exports = router;