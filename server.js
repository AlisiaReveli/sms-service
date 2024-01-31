const express = require('express');
const bodyParser = require('body-parser');
const AWS = require('aws-sdk');

AWS.config.update({
  accessKeyId: 'AKIA53UIZI6WABULQPOV',
  secretAccessKey: 'yr1NuX75HLL72l1IwbRY4nGzRAKDArrjLeuBPvKv',
  region: 'eu-west-3', // Replace with your AWS region
});

const sns = new AWS.SNS();

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

app.post('/send-sms', (req, res) => {
  const { phoneNumber, message, senderId } = req.body;

  const params = {
    Message: message,
    PhoneNumber: phoneNumber,
    MessageAttributes: {
      'AWS.SNS.SMS.SenderID': {
        DataType: 'String',
        StringValue: senderId,
      },
    },
  };

  sns.publish(params, (err, data) => {
    if (err) {
      console.error('Error sending SMS:', err);
      res.status(500).send('Error sending SMS');
    } else {
      console.log('SMS sent successfully:', data.MessageId);
      res.status(200).send('SMS sent successfully');
    }
  });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
