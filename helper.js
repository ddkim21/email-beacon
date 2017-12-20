const request = require('request');
const validator = require('validator');

function getURLForRecipientEmail(recipient){
    if (!validator.isEmail(recipient)){
        console.error("getURLForRecipientEmail must take in an email string!");
    }

}

// getURLForRecipientEmail("hello");

let url;
request.get("http://localhost:3000/getUrl/hello@test.com", (error, response, body) => {
    url = body;
    console.log(url);

    request.get(url, (error, response, body) => {
        console.log(body);
    });
});
