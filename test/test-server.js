import assert from 'assert';
import request from 'supertest';
import config from 'config';

import INVALID_PARAMETERS_ERROR from '../src/constants';

let server = require('../dist/server');
//Key for posted Email Object.
let imageKey;

describe('GET /health', function() {
    it('should respond with OK', function(done){
        request(server)
            .get('/health')
            .expect(200)
            .end((error, response) => {
                if (error) done(error);
                else done();
            });
    });
});

describe('GET /getUrl/:email', function() {
    it('should return an URL for an image', function(done){
        const baseImageUrl = `${config.get("domain")}/image/`;
        request(server)
            .get('/getUrl/hello@test.com')
            .expect(200)
            .end((error, response) => {
                if (error) throw done(error);
                const returnedUrl = response.text;
                const urlMatch = returnedUrl.indexOf(baseImageUrl);
                imageKey = returnedUrl.substring(baseImageUrl.length, returnedUrl.length);
                if (urlMatch === -1) done(new Error("Return is not a URL!"));
                else done();
            });
    });

    it('should return an error if sent a non-email address', function(done){
        request(server)
            .get('/getUrl/hello')
            .expect(400)
            .end((error, response) => {
                if (error) throw done(error);
                else done();
            });
    });
});

describe('GET /image/:uuid', function() {
    it('should return an image for a valid image uuid', function(done){
        request(server)
            .get(`/image/${imageKey}`)
            .expect(200)
            .expect('Content-Type', 'image/png')
            .end((error, response) => {
                if (error) throw done(error);
                else done();
            });
    });

    it('should return an error if sent an invalid image uuid', function(done){
        request(server)
            .get('/image/1')
            .expect(400)
            .end((error, response) => {
                if (error) throw done(error);
                else done();
            })
    });
});

server.close();