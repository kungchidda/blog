var AWS = require("aws-sdk");
const s3 = new AWS.S3()

AWS.config.update({
    region: "ca-central-1",
    endpoint: "https://dynamodb.ca-central-1.amazonaws.com"
});

var docClient = new AWS.DynamoDB.DocumentClient();
var table = "blog";

exports.rootHandler = (event, context, callback) => {
    console.log("홍성준 event = ", event);
    const operation = event.httpMethod;
    var params = {
        TableName: table,
        Item:
            JSON.parse(event.body)
    }
    switch (operation) {
        //create new item
        case 'POST':
            docClient.put(params, callback);
            break;

        //listing all items
        case 'GET':
            docClient.scan(params, (err, data) => {
                callback(null, {
                    'statusCode': 200,
                    'headers': {},
                    'body': JSON.stringify(data)
                });
            });
            break;

        //update existing item
        case 'PUT':
            docClient.put(params, (err, data) => {
                callback(null, {
                    'statusCode': 200,
                    'headers': {},
                    'body': JSON.stringify(data)
                });
            });
            break;
        default:
            callback(new Error(`Unrecognized operation "${operation}"`));
    }
};

exports.pathHandler = (event, context, callback) => {
    var id = event.pathParameters
    var params = {
        TableName: table,
        Key:
            event.pathParameters
    }
    const operation = event.httpMethod;

    switch (operation) {
        //delete item
        case 'DELETE':
            docClient.delete(params, (err, data) => {
                callback(null, {
                    'statusCode': 200,
                    'headers': {},
                    'body': JSON.stringify(data)
                });
            });
            break;
            // case 'PATCH':
            //     docClient.update(params, (err, data) => {
            //         callback(null, {
            //             'statusCode': 200,
            //             'headers': {},
            //             'body': JSON.stringify(data)
            //         });
            //     });
            //     break;
        //read one item
        case 'GET':
            docClient.get(params, (err, data) => {
                callback(null, {
                    'statusCode': 200,
                    'headers': {},
                    'body': JSON.stringify(data)
                });
            });
            break;
        default:
            callback(new Error(`Unrecognized operation "${operation}"`));
    }

};