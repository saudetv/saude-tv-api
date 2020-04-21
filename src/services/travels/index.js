const mongoose = require("mongoose");
const Model = require("../../models/Travel");

const { validate, setReturnObject } = require("../../helpers/response");

const Entity = "travel";

const index = async (req, res) => {
    if (req.query.hasOwnProperty("name")) {
        req.query.name = {
            $regex: new RegExp(`.*${req.query.name}.*`, "i")
        };
    }
    try {
        const resultQuery = await Model.find(req.query).populate({
            path: "user",
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
    store: store,
    update: update,
    destroy: destroy
}