const express = require('express');
const router = express.Router({ mergeParams: true });

router.get("/", async (req, res) =>{
    try{
        res.sendFile('hc/notfound.html', {root: __dirname })
    }

    catch(err){
        console.error(err);
        return res.status(500).send("Server error")
    }
})

module.exports = router;