const express = require('express');
const router = express.Router();

import {deleteItem, getAll} from "../helpers/utils";

router.get('/users', async function getAllUsers(req, res) {
    await getAll({schemeName: 'User', res});
});

router.delete('/users/:id', async function deleteUserById(req, res) {
    await deleteItem({
        schemeName: 'User',
        fieldName: 'userId',
        id: req.params.id,
        res
    });
});

module.exports = router;