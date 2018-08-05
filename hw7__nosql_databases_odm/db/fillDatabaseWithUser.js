import {db} from "../config/config.json";
import mongoose from 'mongoose';
import {default as userMock} from '../bin/users.json';

const url = `mongodb://${db.mongo.host}:${db.mongo.port}/${db.mongo.dbName}`;
mongoose.connect(url, {useNewUrlParser: true});

const UserModel = mongoose.model('User', require('../models/User'));

for (let i = 0; i < userMock.length; i++) {
    const sample = userMock[i];
    const instance = new UserModel();
    console.log(' >>> instance=', instance);
    console.log(' >>> sample=', sample);

    instance.userId = sample.userId || i;
    instance.username = sample.username;
    instance.email = sample.email;
    instance.password = sample.password;
    instance.passwordHash = sample.passwordHash;

    instance.save()
        .then(data => {
            console.log(' >>> product data=', data);
        })
        .catch(err => console.log(err));
}