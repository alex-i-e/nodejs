const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

// MONGO_URI => "mongodb://<dbuser>:<dbpassword>@<host1>:<port1>,<host2>:<port2>/<dbname>?replicaSet=<replicaSetName>";

function connect(url, dbName, option) {
    return MongoClient
        .connect(url, option)
        .then((err, client) => client.db());
    // .then((err, client) => {
    //         // assert.equal(null, err);
    //         console.log("......Connected successfully to server.......");
    //
    //         console.log('url>>>', url);
    //         console.log('dbName>>>', dbName);
    //         console.log('option>>>', option);
    //         console.log('client>>>', client);
    //
    //
    //         const db = client.db(/*dbName*/);
    //         console.log('db.collection(\'cities\') >>>', db.collection('cities'));
    //
    //         const cursor = db.collection('cities').find();
    //         cursor.forEach(
    //             function (doc) {
    //                 console.log(doc);
    //             },
    //             () => {
    //             });
    //
    //         // client.close();
    //
    //         return db;
    //
    //     }
    // )//.then((err, client) => client.db(dbName));
}

module.exports = (url, dbName, option) => Promise.resolve(connect(url, dbName || '', option || {}));