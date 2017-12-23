# email-beacon

TO BUILD:
npm install
npm run build

TO TEST:
npm test (run after building)

TO RUN SERVER (use curl to test)
npm run start (will also build before running)
curl localhost:4000/getUrl/hello@precognitive.io (run this in another tab)

NOTABLE FILES
server.js:
  - Contains routes that make up the core functionality of the app.
    - '/geturl/:email' will post an email object (stored as string) into the redis database with a unique key.
      - returns a URL for an image request that corresponds to the unique key used to store the email object.
      - returns an error if the input string is not a valid email.
    - '/image/:uuid' will query the redis database for the email object with the unique key. 
      - If an email object with the unique key is found, server.js will:
        - Update the email object (with the relevant IP address of access, time opened, etc.) and post it to redis.
        - console.log details on the email access, such as recipient email, ip address, and on reopen, whether it was opened on the same device as the first email.
      - If an email object with the unique key is not found, server.js will return an error.

redis-helpers.js
  - Contains helper functions that return function promises containing redis requests for a given redis server. 
    - storeObjectThunk returns a function that returns a promise to store an email object to redis.
    - getObjectThunk returns a function that returns a promise to get an email object from redis.

constants.js
  - Stores error messages used across the app for various error cases (including error cases not covered in my description of server.js above, such as redis client failure)
  - Stores appended email accessor for email object UUIDs. 

helpers.js
  - Helpers involving error handling and console.logging the details of the email access.

test/test-server.js
  - Tests include:
    - Getting health endpoint of the server.
    - '/geturl/:email' accessed with a valid email.
    - '/geturl/:email' accessed with an invalid string.
    - '/image/:uuid' accessed with uuid generated from first call to '/geturl/:email'
    - '/image/:uuid' accessed with invalid uuid.