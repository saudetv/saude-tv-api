const mongoose = require("mongoose");

const CustomerSchema = new mongoose.Schema({
  corporateName: { type: String, required: true },
  fantasyName: { type: String, required: true },
  cnpj: { type: String },
  acting: { type: String },
  address: { type: String },
  number: { type: String },
  complement: { type: String },
  district: { type: String },
  city: { type: String },
  cep: { type: String },
  state: { type: String },
  cellPhone: { type: String },
  logo: { type: String },
  primaryColor: { type: String },
  secondaryColor: { type: String },
  terminals: [{ type: mongoose.Schema.Types.ObjectId, ref: "Terminal" }],
});

module.exports = mongoose.model("Customer", CustomerSchema);
