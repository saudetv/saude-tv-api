var mongoose = require('mongoose');
var capitalize = require('capitalize')
const { validate, setReturnObject } = require("./response");

const index = async (data, entity) => {
  console.log(data);
  if (data.message == 'null' || data.message === 'false' || data.message.length === 0 || data.message === '[]')
    return await applicationError(data, entity);
  return await dbError(data, entity)
}

const dbError = async (data, entity) => {
  if (data.hasOwnProperty('code')) {
    if (data.code === 11000) {
      var returnMessage = `${capitalize(entity)} ${data.message}`
      var data = await setReturnObject(null, entity, "DUPLICATED", returnMessage, 409)
    }
  } else {
    var errors = [];
    if (data.hasOwnProperty('errors')) {
      Object.entries(data.errors).forEach((element, index) => {
        errors[index] = {
          message: element[1].message,
          error: element[1].name
        }
      });
      var returnMessage = `${data._message}`
      var data = await setReturnObject(errors, entity, data.name, data._message, 400, true)
    } else {
      var data = await setReturnObject(data.reason, entity, data.name, data.message, 400, true)
    }
  }
  return data
}

const applicationError = async (data, entity) => {
  if (data !== null || data !== false || data.length !== 0) {
    var returnMessage = `${entity} ${process.env.MESSAGE_NOT_FOUND}`
    var data = await setReturnObject(null, entity, process.env.CODE_NOT_FOUND, returnMessage, 404)
  } else {
    var data = await setReturnObject(null, entity, process.env.CODE_EMPTY, `${capitalize(entity)} ${process.env.MESSAGE_EMPTY}`, 404)
  }
  return data
}

module.exports = index
