const dynamo = require('dynamo-client');
const express = require('express');
const app = express();
const db = dynamo.createClient({ host: process.env.DYNAMO_HOST, port: process.env.DYNAMO_PORT });
console.log("DB", db.DocumentClient);
// var docClient = new db.DocumentClient({ apiVersion: '2012-08-10' });

var params = {
    TableName: 'TABLE',
    Item: {
        Artist: 'Fulano de Tal',
        SongTitle: 'Musica X '
    }
};



// db.request("CreateTable", {
//     TableName: params.TableName,
//     AttributeDefinitions: [
//         {
//             AttributeName: 'Artist',
//             AttributeType: 'S',
//         },
//         {
//             AttributeName: 'SongTitle',
//             AttributeType: 'S',
//         }
//     ],
//     "KeySchema": [
//         {
//             "KeyType": "HASH",
//             "AttributeName": "Artist"
//         },
//         {
//             "KeyType": "RANGE",
//             "AttributeName": "SongTitle"
//         }
//     ],
//     ProvisionedThroughput: {
//         ReadCapacityUnits: 10,
//         WriteCapacityUnits: 5
//     }

// }, function (_err, _data) {
//     console.log("CREATE TABLE", _err, _data);
//     if (_err) {
//         return
//     }
//     db.request("Get", { TableName: params.TableName, Key: { Artist: 'Fulano de Tal', } }, function (err, data) {
//         if (err) {
//             console.log("Error", err);
//         } else {
//             console.log("Success", data);
//         }
//     });

// })

app.get('/', (_, res) => {
    res.send(`
        <form method="GET" action="/query">
            <input name="name" placeholder="name" />
        </form>
    `)
})
app.get('/query', (req, res) => {
    console.log("req", req.query)
    db.request('Scan', {
        TableName: params.TableName,
        // KeyConditionExpression: "#Ar  = :Artist",
        // FilterExpression :  "#Ar  = :SongTitle",
        // ExpressionAttributeNames: { "#Ar": "SongTitle" },
        // ExpressionAttributeValues: { ":SongTitle": req.query.name }
        ProjectionExpression: "Artist, SongTitle",
        FilterExpression: "begins_with (Artist,:Artist)",
        // ExpressionAttributeNames: {
        //     "#Artist": ":Artist",
        // },
        ExpressionAttributeValues: {
            ":Artist": req.query.name,
        }
    }, function (err, result) {
        console.log("GetItems", err, result);
        if (err) {
            return res.status(500).send({ err: err })
        }
        return res.status(200).send(result)

    })
})

app.listen(3003, function () {
    console.log("App Listem")
});