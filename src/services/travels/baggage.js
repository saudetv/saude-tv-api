const mongoose = require("mongoose");
const Model = require("../../models/Travel");
const errorHandler = require("../../helpers/errorHandler")

const { validate, setReturnObject } = require("../../helpers/response");

const Entity = "baggage";

const index = async (req, res) => {
    try {
        const resultQuery = await Model.find(req.query)
        let result = await validate(
            resultQuery[0].baggage,
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
    try {
        let resultQuery = null;
        if (mongoose.Types.ObjectId.isValid(req.params.id))
            resultQuery = await Model.findById(req.params.id)
        if (resultQuery) {
            resultQuery.baggage.push(req.body);
            await resultQuery.save();
        }
        let result = await validate(
            resultQuery,
            Entity,
            process.env.CODE_FOUND,
            process.env.MESSAGE_FOUND
        );
        res.json(result);
    } catch (error) {
        var result = await errorHandler(error, Entity)
        res.status(result.statusCode).json(result);
    }
}

const show = async (req, res) => {
    try {
        let resultQuery = null;
        if (mongoose.Types.ObjectId.isValid(req.params.id))
            resultQuery = await Model.findOne({ _id: req.params.id, "baggage._id": req.params.baggageId })
        var resultFiltered = resultQuery.baggage.filter((value) => {
            return value._id == req.params.baggageId
        });
        let result = await validate(
            resultFiltered[0],
            Entity,
            process.env.CODE_FOUND,
            process.env.MESSAGE_FOUND
        );
        res.json(result);
    } catch (error) {
        var result = await errorHandler(error, Entity)
        res.status(result.statusCode).json(result);
    }
}

const update = async (req, res) => {
    var baggage = {};
    Object.entries(req.body).forEach(element => {
        baggage["baggage.$." + element[0]] = element[1]
    });
    try {
        let resultQuery = null;
        if (mongoose.Types.ObjectId.isValid(req.params.id)) {
            resultQuery = await Model.findOneAndUpdate(
                { _id: req.params.id, "baggage._id": req.params.baggageId },
                baggage,
                { new: true }
            );
        }
        var resultFiltered = resultQuery.baggage.filter((value) => {
            return value._id == req.params.baggageId
        });
        let result = await validate(
            resultFiltered[0],
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

const changeStatus = async (req, res) => {
    try {
        let resultQuery = null;
        if (mongoose.Types.ObjectId.isValid(req.params.id)) {
            resultQuery = await Model.findOneAndUpdate(
                { _id: req.params.id, "baggage._id": req.params.baggageId },
                { "baggage.$.status": req.body.status },
                { new: true }
            );
        }
        var resultFiltered = resultQuery.baggage.filter((value) => {
            return value._id == req.params.baggageId
        });
        let result = await validate(
            resultFiltered[0],
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
            resultQuery = await Model.findOneAndUpdate(
                { _id: req.params.id, "baggage._id": req.params.baggageId },
                {
                    $pull: { baggage: { _id: req.params.baggageId } }
                },
                { new: true }
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
module.exports = {
    store,
    show,
    update,
    changeStatus,
    destroy,
    index
}