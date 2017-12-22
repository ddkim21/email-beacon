import {UNKNOWN_ERROR, KEY_NOT_FOUND_ERROR} from './constants';

export const storeObjectThunk = redis => (obj, identifier) => {
    return new Promise((resolve, reject) => {
        if (!obj || !identifier || !obj.uuid){
            console.error("missing value for object store");
            reject(UNKNOWN_ERROR);
        }
        
        const key = obj.uuid + identifier;
        const stringifiedObject = JSON.stringify(obj);
        redis.set(key, stringifiedObject, (err, reply) => {
            if (err){
                reject(UNKNOWN_ERROR);
            }
            resolve(obj);
        })
    });
};

export const getObjectThunk = redis => (uuid, identifier) => {
    return new Promise((resolve, reject) => {
        if (!uuid || !identifier){
            console.error("missing identifier for object get");
            reject(UNKNOWN_ERROR);
        }
        const key = uuid + identifier;
        redis.get(key, (err, reply) => {
            if (err){
                return reject(UNKNOWN_ERROR);
            } else if (reply == null){
                return reject(KEY_NOT_FOUND_ERROR);
            } else {
                return resolve(JSON.parse(reply));
            }
        })
    })
};