const mongoose = require("mongoose");

const BaggageItemSchema  = new mongoose.Schema({
    name: { type: String, required: true },
    type: { type: String, required: true },
    status: { type: Boolean, required: true, default: false },
});

const AccommodationSchema = new mongoose.Schema({
    name: { type: String, required: true },
    address: { type: String, required: true, default: 'city' },
    contact: { type: String }
});

const RouteSchema = new mongoose.Schema({
    destination: { type: String, required: true },
    type: { type: String, required: true, default: 'city' },
    accommodation: AccommodationSchema,
    departureDate: { type: Date, required: true },
    arrivalDate: { type: Date, required: true },
    createdAt: { type: Date, default: Date.now() },
    route: [this]
});

const TravelSchema = new mongoose.Schema({
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    name: { type: String, required: true },
    departureDate: { type: Date, required: true },
    arrivalDate: { type: Date, required: true },
    description: { type: String },
    type: { type: String, required: true, default: 'multicity' },
    createdAt: { type: Date, default: Date.now() },
    status: { type: Boolean, required: true, default: true },
    baggage: [BaggageItemSchema],
    route: [RouteSchema]
});

module.exports = mongoose.model("Travel", TravelSchema);
