import {UNKNOWN_ERROR, KEY_NOT_FOUND_ERROR} from './constants';

export const storeObjectThunk = redis => (obj, identifier, cb) => {
    if (!obj || !identifier || !obj.uuid){
        console.error("missing value for object store");
        return cb(UNKNOWN_ERROR);
    }
    const key = obj.uuid + identifier;
    const stringifiedObject = JSON.stringify(obj);
    redis.set(key, stringifiedObject, (err, reply) => {
        if (err){
            return cb(UNKNOWN_ERROR);
        }
        return cb(null, reply);
    })
}

export const getObjectThunk = redis => (uuid, identifier, cb) => {
    if (!uuid || !identifier){
        console.error("missing identifier for object get");
        return cb(UNKNOWN_ERROR);
    }
    const key = uuid + identifier;
    redis.get(key, (err, reply) => {
        if (err){
            return cb(UNKNOWN_ERROR);
        } else if (reply == null){
            return cb(KEY_NOT_FOUND_ERROR);
        } else {
            return cb(null, reply);
        }
    })
}