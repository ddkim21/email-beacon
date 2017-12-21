import express from 'express';
import config from 'config';
import bluebird from 'bluebird';
import uuidv4 from 'uuid/v4';
import redis from 'redis-mock';

bluebird.promisifyAll(redis.RedisClient.prototype);

import {DATA_TYPES, INVALID_PARAMETERS_ERROR, UNKNOWN_ERROR, KEY_NOT_FOUND_ERROR} from './constants';
import {storeObjectThunk, getObjectThunk} from './redis-helpers';

let _app = express();
let _client = redis.createClient();

_app.get('/health', (req, res) => res.send('ok'));

_app.get('/getUrl/:email', (req, res) => {
    const validEmailRegex = /[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
    const isValidEmail = validEmailRegex.test(req.params.email);
    
    if(!isValidEmail){
        res.status(400).send(INVALID_PARAMETERS_ERROR);
        return;
    }

    let baseImageUrl = `${config.get("domain")}/image/`;

    const uuid = uuidv4();
    const imageUrl = `${baseImageUrl + uuid}`;

    const emailObject = {
        uuid,
        imageUrl,
        lastOpened: null,
        createdAt: Date.now(),
        hasOpened: false,
        ipOfOpened: []
    };

    const storeObject = storeObjectThunk(_client);

    storeObject(emailObject, DATA_TYPES.EMAIL, (err, reply) => {
        if (err){
            res.status(500).send(err);
        }
        res.status(200).send(imageUrl);  
    })
})

_app.get('/image/:uuid', (req, res) => {
    const uuid = req.params.uuid;

    const getObject = getObjectThunk(_client);

    getObject(uuid, DATA_TYPES.EMAIL, (err, reply) => {
        if (err == UNKNOWN_ERROR){
            res.status(500).send(err);
        } else if (err == KEY_NOT_FOUND_ERROR){
            res.status(400).send(KEY_NOT_FOUND_ERROR);
        } else {
            //MUST FIRST UPDATE REDIS WITH NEW DATA BEFORE SENDING IMAGE!
            res.status(200).sendFile(`${config.get("domain")}/public/1x1.png`);
        }
    })
})

_app.listen(3000, () => {
    console.log("listening on port 3000!");
})