var capitalize = require('capitalize')


var validate = async (data, entity, code = null, message = null, statusCode = null) => {
  if (data === null || data === false) {
    var returnMessage = message ? message : `${capitalize(entity)} ${process.env.MESSAGE_NOT_FOUND}`
    var data = await setReturnObject(data, entity, process.env.CODE_NOT_FOUND, returnMessage, 404)
    throw new Error(JSON.stringify(data));
  } else if (data.length === 0) {
    var data = await setReturnObject(null, entity, process.env.CODE_EMPTY, `${capitalize(entity)} ${process.env.MESSAGE_EMPTY}`, 404)
    throw new Error(JSON.stringify(data));
  } else {
    var data = await setReturnObject(data, entity, code, `${capitalize(entity)} ${message}`, 200)
  }
  return data;
}

var setReturnObject = async (data, entity, code, message, statusCode) => {
  var data = {
    statusCode: statusCode,
    data: data,
    message: message,
    entity: entity,
    code: code
  }
  if (data.data === null) {
    delete data.data
  }
  return data;
}

module.exports = {
  validate: validate,
  setReturnObject: setReturnObject
}
