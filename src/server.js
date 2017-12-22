import express from 'express';
import config from 'config';
import uuidv4 from 'uuid/v4';
import redis from 'redis-mock';
import path from 'path';

import {DATA_TYPES, INVALID_PARAMETERS_ERROR, UNKNOWN_ERROR, KEY_NOT_FOUND_ERROR} from './constants';
import {storeObjectThunk, getObjectThunk} from './redis-helpers';
import {getStatusForErrorMessage, mockNotificationEmailOpened} from './helpers';

let _app = express();
let _client = redis.createClient();

_app.get('/health', (req, res) => res.send('ok'));

_app.get('/getUrl/:email', (req, res) => {
    const email = req.params.email;
    const validEmailRegex = /[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
    const isValidEmail = validEmailRegex.test(email);
    
    if(!isValidEmail){
        const statusNumber = getStatusForErrorMessage(INVALID_PARAMETERS_ERROR);
        res.status(statusNumber).send(INVALID_PARAMETERS_ERROR);
        return;
    }

    const baseImageUrl = `${config.get("domain")}/image/`;
    const uuid = uuidv4();
    const imageUrl = `${baseImageUrl + uuid}`;

    const emailObject = {
        uuid,
        email,
        imageUrl,
        lastOpened: null,
        createdAt: Date.now(),
        hasOpened: false,
        ipOfOpened: []
    };

    const storeObject = storeObjectThunk(_client);

    storeObject(emailObject, DATA_TYPES.EMAIL).then(
        (success) => {
            res.status(200).send(imageUrl);
        }
    ).catch(
        (error) => {
            const statusNumber = getStatusForErrorMessage(error);
            res.status(statusNumber).send(error);
        }
    );
});

_app.get('/image/:uuid', (req, res) => {
    const uuid = req.params.uuid;

    const getObject = getObjectThunk(_client);

    getObject(uuid, DATA_TYPES.EMAIL).then(
        (emailObject) => {
            const ipOfRequester = req.connection.remoteAddress;
            
            if (!emailObject.ipOfOpened){
                throw UNKNOWN_ERROR;
            }

            emailObject.lastOpened = Date.now();
            emailObject.hasOpened = true;
            emailObject.ipOfOpened.push(ipOfRequester);
            
            const storeObject = storeObjectThunk(_client);
            return storeObject(emailObject, DATA_TYPES.EMAIL);
        }
    ).then(
        (emailObject) => {
            console.log("this case is being run!");
            mockNotificationEmailOpened(emailObject);
            res.status(200).sendFile(path.resolve('public/1x1.png'));            
        }
    ).catch(
        (error) => {
            console.log("this error is being run!");
            console.log(error);
            const statusNumber = getStatusForErrorMessage(error);
            res.status(statusNumber).send(error);
        }
    );
});

_app.listen(4000, () => {
    console.log("listening on port 4000!");
});