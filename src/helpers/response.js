var capitalize = require('capitalize')


var validate = async (data, entity, code = null, message = null, statusCode = null) => {
  if (data !== null && data !== false && data.length !== 0) {
    var data = await setReturnObject(data, entity, code, `${capitalize(entity)} ${message}`, 200)
  } else {
    throw new Error(JSON.stringify(data));
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
