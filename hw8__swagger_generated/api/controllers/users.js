var util = require('util');

import {deleteItem, getAll} from "../helpers/utils";

module.exports = {
    getUsers,
    deleteUser
};

async function getUsers(req, res) {
    await getAll({schemeName: 'User', res});
}

async function deleteUser(req, res) {
    await deleteItem({
        schemeName: 'User',
        fieldName: 'userId',
        id: req.swagger.params.id.value,
        res
    });
}