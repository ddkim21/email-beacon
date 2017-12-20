const express = require('express');
const redis = require('redis-mock');

let _app = express();
let _client = redis.createClient();

// client.set("string key", "string val", (err, resp) => {
//     console.log(resp);
// });
// client.get("string key", (error, reply) => {
//     console.log(reply);
// })

_app.get('/getUrl/:email', (req, res) => {
    let baseImageUrl = "http://localhost:3000/image/";
    let imageId = Date.now();

    _client.set(imageId, req.params.email, (err, reply) => {
        if (err) {
            //TODO: Handle error.
        }
        res.send(baseImageUrl + imageId);
    });

})

_app.get('/image/:id', (req, res) => {
    let imageId = req.params.id;

    _client.get(imageId, (err, reply) => {
        if (err) {
            //TODO: Handle error.
        }
        //TODO: give back actual image.
        //Process data and add data to DB.
        res.send(reply);
    })
})

_app.listen(3000, () => {
    console.log("listening on port 3000!");
})