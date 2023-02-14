var capitalize = require('capitalize')


var validate = async (data, entity, code = null, message = null, statusCode = null) => {
  console.log(data);
  if (data !== null && data !== false && data.length !== 0) {
    var data = await setReturnObject(data, entity, code, `${capitalize(entity)} ${message}`, 200)
  } else {
    throw new Error(JSON.stringify(data));
  }
  return data;
}

const setReturnObject = async (data, entity, code, message, statusCode, error = false) => {
  var returnObject = {
    statusCode: statusCode,
    message: message,
    entity: entity,
    code: code
  }
  if (data && !error) {
    returnObject.data = data
  }
  if (error) {
    returnObject.errors = data
  }
  return Promise.resolve(returnObject)
}

module.exports = {
  validate: validate,
  setReturnObject: setReturnObject
}
