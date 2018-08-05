var util = require('util');

import {deleteItem, getAll} from "../helpers/utils";

module.exports = {
    getUsers: getUsers
};

/*
  Functions in a127 controllers used for operations should take two parameters:

  Param 1: a handle to the request object
  Param 2: a handle to the response object
 */
async function getUsers(req, res) {
    // variables defined in the Swagger document can be referenced using req.swagger.params.{parameter_name}
    // var name = req.swagger.params.name.value || 'stranger';

    await getAll({schemeName: 'User', res});
}