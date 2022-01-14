const mongoose = require("mongoose");

const AdvertiseSchema = new mongoose.Schema({
  adDialog: { type: String, required: true },
  adInfoName: { type: String, required: true },
  adInfoDescription: { type: String },
  adItemsSelected: { type: Array, required: true },
  filterSpecialties: { type: Array, required: true},
  admins: { type: Array, required: true },
  cruds: { type: Array, required: true },
  slides: { type: Array },
  adCardsName: { type: String, required: true },
  adCardsAdress: { type: String, required: true },
  adCardsViewsPerDay: { type: String, required: true },
  adCardsImpactNumbers: { type: String, required: true },
  drawerDisplays: { type: String, required: true },
  drawerSocialClass: { type: String, required: true },
  drawerMonthlyFlow: { type: String, required: true },
  drawerCategories: { type: String, required: true },
  drawerSpecialties: { type: String, required: true },
  drawerScreenProportion: { type: String, required: true },
  drawerWorkingTimeOpening: { type: String, required: true },
  drawerWorkingTimeClose: { type: String, required: true },
  specialtiesItems: { type: Array },
});

module.exports = mongoose.model("Advertise", AdvertiseSchema);
