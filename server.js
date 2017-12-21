const express = require('express');
const redis = require('redis-mock');
const bluebird = require('bluebird');

bluebird.promisifyAll(redis.RedisClient.prototype);

let _app = express();
let _client = redis.createClient();

_app.get('/getUrl/:email', (req, res) => {
    let baseImageUrl = "http://localhost:3000/image/";
    let imageId = Date.now();

    _client.set(imageId, req.params.email, (err, reply) => {
        if (err) {
            res.status(500).send('Something broke!');
        } else {
            res.send(baseImageUrl + imageId);
        }
    });
})

_app.get('/image/:id', (req, res) => {
    let imageId = req.params.id;

    _client.get(imageId, (err, reply) => {
        if (err) {
            res.status(500).send('Something broke!');
        } else if (reply == null){
            res.status(204).send("Image URL not found!");
        } else {
            //TODO: Process data and add data to DB.
            res.sendFile(__dirname + "/public/1x1.png");
        }
    })
})

_app.listen(3000, () => {
    console.log("listening on port 3000!");
})

function storeData(){

}