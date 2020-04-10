var capitalize = require('capitalize')

module.exports = {
  async validate(data, entity, code = null, message = null, statusCode = null) {
    if (data === null || data === false) {
      var data = {
        statusCode: 404,
        data: data,
        message: message ? message : `${capitalize(entity)} ${process.env.MESSAGE_NOT_FOUND}`,
        entity: entity,
        code: process.env.CODE_NOT_FOUND
      }
      throw new Error(JSON.stringify(data));
    } else if (data.length === 0) {
      var data = {
        statusCode: 404,
        data: data,
        message: `${capitalize(entity)} ${process.env.MESSAGE_EMPTY}`,
        entity: entity,
        code: process.env.CODE_IS_EMPTY
      }
      throw new Error(JSON.stringify(data));
    } else {
      var data = {
        statusCode: 200,
        data: data,
        message: `${capitalize(entity)} ${message}`,
        entity: entity,
        code: code
      }
    }
    return data;
  },

  async setCustomError(data, entity, code, message, statusCode) {
    var data = {
      statusCode: statusCode,
      data: data,
      message: message,
      entity: entity,
      code: code
    }
    return data;
  }
};
