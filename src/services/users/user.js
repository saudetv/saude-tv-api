const mongoose = require("mongoose");
const Model = require("../../models/User");

const { validate, setReturnObject } = require("../../helpers/response");

const Entity = "user";

const index = async (req, res) => {
    if (req.query.hasOwnProperty("name")) {
        req.query.name = {
            $regex: new RegExp(`.*${req.query.name}.*`, "i")
        };
    }
    if (req.query.hasOwnProperty("token")) {
        req.query.auth = { token: req.query.token };
        delete req.query.token;
    }
    try {
        const resultQuery = await Model.find(req.query).populate({
            path: "profile",
            populate: {
                path: "profileModule.module"
            }
        });
        let result = await validate(
            resultQuery,
            Entity,
            process.env.CODE_FOUND,
            process.env.MESSAGE_FOUND
        );
        if (req.query.hasOwnProperty("auth")) result.data = result.data[0];

        res.json(result);
    } catch (error) {
        let result = JSON.parse(error.message);
        res.status(result.statusCode).json(result);
    }
}

const show = async (req, res) => {
    try {
        let resultQuery = null;
        if (mongoose.Types.ObjectId.isValid(req.params.id))
            resultQuery = await Model.findById(req.params.id)
        let result = await validate(
            resultQuery,
            Entity,
            process.env.CODE_FOUND,
            process.env.MESSAGE_FOUND
        );
        res.json(result);
    } catch (error) {
        let result = JSON.parse(error.message);
        res.status(result.statusCode).json(result);
    }
}

const checkAuth = async (req, res) => {
    if (req.query.hasOwnProperty("token")) {
        req.query.auth = { token: req.query.token };
        delete req.query.token;
        try {
            let resultQuery = null;
            resultQuery = await Model.findOne(req.query).populate({
                path: "profile",
                populate: {
                    path: "profileModule.module"
                }
            });
            let result = await validate(
                resultQuery,
                Entity,
                process.env.CODE_FOUND,
                process.env.MESSAGE_FOUND
            );
            res.json(result);
        } catch (error) {
            let result = JSON.parse(error.message);
            res.status(result.statusCode).json(result);
        }
    } else {
        let error = await setReturnObject(
            null,
            Entity,
            null,
            "Please send correct params",
            406
        );
        res.status(406).json(error);
    }
}

const store = async (req, res) => {
    const resultQuery = await Model.create(req.body);
    try {
        let result = await validate(
            resultQuery,
            Entity,
            process.env.CODE_CREATED,
            process.env.MESSAGE_CREATED
        );
        res.json(result);
    } catch (error) {
        let result = JSON.parse(error.message);
        res.status(result.statusCode).json(result);
    }
}
const update = async (req, res) => {
    try {
        let resultQuery = null;
        if (mongoose.Types.ObjectId.isValid(req.params.id)) {
            resultQuery = await Model.findOneAndUpdate(
                { _id: req.params.id },
                req.body,
                {
                    new: true
                }
            );
        }
        let result = await validate(
            resultQuery,
            Entity,
            process.env.CODE_UPDATED,
            process.env.MESSAGE_UPDATED
        );
        res.json(result);
    } catch (error) {
        let result = JSON.parse(error.message);
        res.status(result.statusCode).json(result);
    }
}

const destroy = async (req, res) => {
    try {
        let resultQuery = null;
        if (mongoose.Types.ObjectId.isValid(req.params.id)) {
            resultQuery = await Model.findOneAndDelete({ _id: req.params.id });
        }
        let result = await validate(
            resultQuery,
            Entity,
            process.env.CODE_DELETED,
            process.env.MESSAGE_DELETED
        );
        res.json(result);
    } catch (error) {
        let result = JSON.parse(error.message);
        res.status(result.statusCode).json(result);
    }
}


module.exports = {
    index: index,
    show: show,
    checkAuth: checkAuth,
    store: store,
    update: update,
    destroy: destroy
}