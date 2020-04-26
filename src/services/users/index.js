const Model = require("../../models/User");
const Travel = require("../../models/Travel");
const mongoose = require("mongoose");
const Service = require('../service');
const Entity = 'user'

class User extends Service {
    constructor() {
        super(Entity, Model);
    }

    index = (req, res) => {
        super.index(req, res)
    }

    show = (req, res) => {
        super.show(req, res)
    }

    store = (req, res) => {
        super.store(req, res)
    }

    update = (req, res) => {
        super.update(req, res)
    }

    destroy = (req, res) => {
        super.destroy(req, res)
    }

    associateTravel = async (req, res) => {
        super.default(req, res, null, async () => {
            if (mongoose.Types.ObjectId.isValid(req.params.id))
                var user = await Model.findById(req.params.id)
            if (mongoose.Types.ObjectId.isValid(req.params.travelId))
                var travel = await Travel.findById(req.params.travelId)
            user.myTravels.push(travel);
            await user.save();
            return user
        })
    }
}

module.exports = User