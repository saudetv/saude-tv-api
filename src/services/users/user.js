const mongoose = require("mongoose");
const Model = require("../../models/User");
const Travel = require("../../models/Travel");

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
        const resultQuery = await Model.find(req.query).populate("myTravels");
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

const associateTravel = async (req, res) => {
    if (mongoose.Types.ObjectId.isValid(req.params.id))
        user = await Model.findById(req.params.id)
    if (mongoose.Types.ObjectId.isValid(req.params.travelId))
        travel = await Travel.findById(req.params.travelId)
    user.myTravels.push(travel); 
    try {
        let result = await validate(
            user,
            Entity,
            process.env.CODE_CREATED,
            process.env.MESSAGE_CREATED
        );
        await user.save();
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

const login = async (req, res) => {
    const resultQuery = await Model.findOne({
        username: req.body.username
    }).populate({
        path: "profile",
        populate: {
            path: "profileModule.module"
        }
    });
    try {
        await validate(resultQuery, Entity, process.env.CODE_FOUND);
    } catch (error) {
        let result = JSON.parse(error.message);
        res.status(result.statusCode).json(result);
    }
    const isPasswordMatch = resultQuery.password === req.body.password;
    if (!isPasswordMatch) {
        let error = await setCustomError(
            null,
            Entity,
            null,
            "Wrong password",
            400
        );
        res.status(400).json(error);
    }
    if (resultQuery.status === true) {
        const token = await generateToken(resultQuery);
        resultQuery.auth.token = token;
        await resultQuery.save();
        res.json(await validate(resultQuery, Entity, process.env.CODE_FOUND));
    } else {
        let error = await setCustomError(
            null,
            Entity,
            null,
            "Your user is inactive",
            400
        );
        res.status(400).json(error);
    }
}

module.exports = {
    index: index,
    show: show,
    checkAuth: checkAuth,
    store: store,
    update: update,
    destroy: destroy,
    login: login,
    associateTravel: associateTravel
}