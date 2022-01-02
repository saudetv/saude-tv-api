const mongoose = require("mongoose");

const InvestimentSchema = new mongoose.Schema({
  value: { type: Number, required: true },
  currencyValue: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now() },
});

const EarningSchema = new mongoose.Schema({
  value: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now() },
});

const WithdrawSchema = new mongoose.Schema({
  value: { type: Number, required: true },
  currencyValue: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now() },
});

const ProjectSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  coingeckoCode: { type: String, required: true },
  createdAt: { type: Date, default: Date.now() },
  updatedAt: { type: Date, default: Date.now() },
  investiments: [InvestimentSchema],
  withdrawals: [WithdrawSchema],
  earnings: [EarningSchema],
});

module.exports = mongoose.model("Project", ProjectSchema);
