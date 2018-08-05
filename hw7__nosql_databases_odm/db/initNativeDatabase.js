const MongoClient = require('mongodb').MongoClient;

// MONGO_URI => "mongodb://<dbuser>:<dbpassword>@<host1>:<port1>,<host2>:<port2>/<dbname>?replicaSet=<replicaSetName>";

function connect(url, option) {
    return MongoClient
        .connect(url, option)
        .then((client) => {
                console.log("......Connected successfully to server.......");

                const db = client.db();
                // client.close();

                return db;

            }
        ).catch((err) => {
            console.log(err);
        })
}

module.exports = (url, option) => connect(url, option || {});