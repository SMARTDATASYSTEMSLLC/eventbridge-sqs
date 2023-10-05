const AWS = require('aws-sdk');

exports.handler = async (event) => {
    const sqs = new AWS.SQS();

    const params = {
        MessageBody: JSON.stringify({ message: 'Hello, SQS!' }),
        QueueUrl: 'YOUR_SQS_QUEUE_URL'  // Replace with your SQS queue URL
    };

    await sqs.sendMessage(params).promise();

    return {
        statusCode: 200,
        body: JSON.stringify('Message sent to SQS!')
    };
};
