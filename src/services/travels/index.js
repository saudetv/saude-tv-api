const Model = require("../../models/Travel");
const Service = require('../service');
const Entity = 'travel'
class Travel extends Service {
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
}

module.exports = Travel