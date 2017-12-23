import assert from 'assert';
import request from 'supertest';

describe('Array', function() {
    describe('#indexOf()', function() {
        it('should return -1 when the value is not present', function() {
            assert.equal([1,2,3].indexOf(4), -1);
        });
    });
});

describe('GET /health', function() {
    let server;
    beforeEach(() => {
        server = require('../dist/server');
    });
    afterEach(() => {
        server.close();
    });

    it('respond with OK', function(done){
        request(server)
            .get('/health')
            .expect(200)
            .end((error, response) => {
                if (error) done(error);
                done();
            });
    });
});
