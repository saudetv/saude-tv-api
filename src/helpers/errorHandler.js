var mongoose = require('mongoose');
var capitalize = require('capitalize')
const { validate, setReturnObject } = require("./response");

const index = async (data, entity) => {
    if (data.message == 'null' || data.message === 'false' || data.message.length === 0)
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
        var returnMessage = `${capitalize(entity)} ${data.errors.type.message}`
        var data = await setReturnObject(null, entity, data.errors.type.name, returnMessage, 400)
    }
    return data;
}

const applicationError = async (data, entity) => {
    if (data !== null || data !== false || data.length !== 0) {
        var returnMessage = `${capitalize(entity)} ${process.env.MESSAGE_NOT_FOUND}`
        var data = await setReturnObject(null, entity, process.env.CODE_NOT_FOUND, returnMessage, 404)
    } else {
        var data = await setReturnObject(null, entity, process.env.CODE_EMPTY, `${capitalize(entity)} ${process.env.MESSAGE_EMPTY}`, 404)
    }
    return data
}

module.exports = index