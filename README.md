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
Server.js:
  - Contains routes that make up the core functionality of the app.
    - '/geturl/:email' will post an email object (stored as string) into the redis database with a unique key.
      - returns a URL for an image request that corresponds to the unique key used to store the email object.
    - '/image/:uuid' will query the redis database for the email object with the unique key. 
      - If an email object with the unique key is found, server.js will:
        - Update the email object (with the relevant IP address of access, time opened, etc.) and post it to redis.
        - console.log details on the email access, such as recipient email, ip address, and on reopen, whether it was opened on the same device as the first email.
      - If an email object with the unique key is not found, server.js will return an error.
