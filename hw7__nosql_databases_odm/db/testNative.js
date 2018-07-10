import {db} from "../config/config.json";

const initDatabases = require('./initDatabase');
const url = `mongodb://${db.mongo.host}:${db.mongo.port}/${db.mongo.dbName}`;

(async () => {
    let dbs;
    try {
        dbs = await initDatabases(url, db.mongo.options);
    } catch (err) {
        console.log(err);
    }

    console.log("......initDatabases......");

    printAllDocsByNative(dbs);
    console.log((await getRandomDocByNative(dbs))[0]);

})();

function printAllDocsByNative(dbs) {
    console.log(' =========== print All ....');

    const cursor = dbs.collection('cities').find();
    cursor.forEach(doc => {
        console.log(doc);
    }, () => {
    });
}

async function getRandomDocByNative(dbs) {
    console.log(' =========== random ....');
    // const myRandomCursor = dbs.collection('cities').aggregate(
    //     [{$sample: {size: 2}}]
    // );
    // const myFirstDocument = myRandomCursor.hasNext() ? await myRandomCursor.next() : null;

    const myRandomCursor = dbs.collection('cities').aggregate(
        [{$sample: {size: 1}}]
    ).toArray();

    return myRandomCursor;
}
