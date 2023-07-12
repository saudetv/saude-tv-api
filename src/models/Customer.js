const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const CustomerSchema = new mongoose.Schema(
  {
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
    terminals: [{ type: Number, ref: "Terminal" }],
  },
  {
    timestamps: true,
  }
);

CustomerSchema.plugin(mongoosePaginate);

module.exports = mongoose.model("Customer", CustomerSchema);
