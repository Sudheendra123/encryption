
const express = require('express');
const bodyParser = require('body-parser');
const CryptoJS = require('crypto-js');

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});
app.get('/admin', (req, res)=>{
    res.sendFile(__dirname+'/admin.html');
})
app.post('/admin/encrypt', (req, res) => {
  const phoneNumber = req.body.phoneNumber;
  res.send(`Encrypted Phone Number: ${encodePhoneNumber(phoneNumber)}`);
});

app.post('/decrypt', (req, res) => {
  const encryptedPhoneNumber = req.body.encryptedPhoneNumber;
  res.send(`Package is successfully delivered ${decodePhoneNumber(encryptedPhoneNumber)}`);
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});


const base36Alphabet = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';

// Function to convert a number to a base-36 string
function base36Encode(number) {
    if (number === 0) return base36Alphabet[0];
    let base36 = '';
    while (number > 0) {
        const remainder = number % 36;
        base36 = base36Alphabet[remainder] + base36;
        number = Math.floor(number / 36);
    }
    return base36;
}

// Function to convert a base-36 string to a number
function base36Decode(base36) {
    return parseInt(base36, 36);
}

// Function to encode a phone number
function encodePhoneNumber(phoneNumber) {
    const key = new Date().getDate(); // Get the current day number
    const number = parseInt(phoneNumber, 10);
    const shiftedNumber = (number + key) % 10000000000;
    return base36Encode(shiftedNumber);
}

// Function to decode a phone number
function decodePhoneNumber(encodedNumber) {
    const key = new Date().getDate(); // Get the current day number
    const shiftedNumber = base36Decode(encodedNumber);
    const originalNumber = (shiftedNumber - key + 10000000000) % 10000000000;
    const decodedNumber = originalNumber.toString().padStart(10, '0');
    sendWhatsAppMessage(decodedNumber, "Package Delivered Successfully!")
    return decodedNumber
}

const twilio = require('twilio');

// Your Twilio account SID and Auth Token
const accountSid = 'AC108f2debc6e7bff2b856c497a607c88a';
const authToken = '178b26f2bcc280a4f5562f526a4217ac';

// Create a Twilio client
const client = new twilio(accountSid, authToken);

// Function to send a WhatsApp message
function sendWhatsAppMessage(to, message) {
    client.messages.create({
        body: message,
        from: '+12526181343', // Your Twilio WhatsApp-enabled number
        to: `+91${to}`
    })
    .then(message => console.log("Message sent", message))
    .catch(error => console.error("Error", error)); // Added a comma and corrected syntax
}
