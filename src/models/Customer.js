const mongoose = require("mongoose");

const CustomerSchema = new mongoose.Schema({
  agency: { type: Array },
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
  contactName: { type: String },
  email: { type: String },
  phone: { type: String },
  cellPhone: { type: String },
  logo: { type: String },
  primaryColor: { type: String },
  secondaryColor: { type: String },
});

module.exports = mongoose.model("Customer", CustomerSchema);
