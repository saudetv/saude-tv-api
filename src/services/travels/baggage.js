const Model = require("../../models/Travel");
const Service = require('../service');
const mongoose = require("mongoose");
const Entity = 'baggage';

class Baggage extends Service {
    constructor() {
        super(Entity, Model);
    }

    index = (req, res) => {
        super.index(req, res, async () => {
            if (mongoose.Types.ObjectId.isValid(req.params.id))
                var resultQuery = await Model.findById(req.params.id)
            return resultQuery.baggage
        })
    }

    show = (req, res) => {
        super.show(req, res, async () => {
            let resultQuery = null;
            if (mongoose.Types.ObjectId.isValid(req.params.id))
                resultQuery = await Model.findOne({ _id: req.params.id, "baggage._id": req.params.baggageId })
            var resultFiltered = resultQuery.baggage.filter((value) => {
                return value._id == req.params.baggageId
            });
            return resultFiltered[0];
        })
    }

    store = (req, res) => {
        super.store(req, res, async () => {
            let resultQuery = null;
            if (mongoose.Types.ObjectId.isValid(req.params.id))
                resultQuery = await Model.findById(req.params.id)
            if (resultQuery) {
                resultQuery.baggage.push(req.body);
                await resultQuery.save();
            }
            return resultQuery;
        })
    }

    update = (req, res) => {
        var baggage = {};
        Object.entries(req.body).forEach(element => {
            baggage["baggage.$." + element[0]] = element[1]
        });
        super.update(req, res, async () => {
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
            return resultFiltered[0]
        })
    }

    changeStatus = (req, res) => {
        super.update(req, res, async () => {
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
            return resultFiltered[0]
        })
    }


    destroy = (req, res) => {
        super.destroy(req, res, async () => {
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
            return resultQuery;
        })
    }
}

module.exports = Baggage