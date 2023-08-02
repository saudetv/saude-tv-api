const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const InstallmentSchema = new mongoose.Schema({
  paid: { type: Boolean },
  installment: { type: Number },
  dueDate: { type: Date },
  receipt: { type: String },
  value: { type: Number },
});
const PaymentSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ["installment", "bankSlip", "pix", "cash", "creditCard"],
    required: true,
  },
  installments: [InstallmentSchema],
});
const ContractSchema = new mongoose.Schema({
  company: { type: mongoose.Schema.Types.ObjectId, ref: "Customer" },
  terminals: { type: Number, ref: "Terminal" },
  section: { type: String, required: true },
  startDate: { type: String, required: true },
  dueDate: { type: Date },
  inserts: { type: Number, required: true },
  unitValue: { type: Number, required: true },
  discount: { type: Number },
  signed: { type: Boolean, required: true, default: false },
  notes: { type: String },
  payment: PaymentSchema,
});

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
    type: {
      type: String,
      enum: ["SUBSCRIBERS", "FRANCHISEE", "ADVERTISERS"],
      default: "SUBSCRIBERS",
    },
    active: {
      type: Boolean,
      default: true,
    },
    terminals: [{ type: Number, ref: "Terminal" }],
    contracts: [ContractSchema],
    subscribers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Customer",
      },
    ],
  },
  {
    timestamps: true,
  }
);

// CustomerSchema.pre("save", function (next) {
//   if (
//     this.subscribers &&
//     this.subscribers.length > 0 &&
//     this.type !== "SUBSCRIBERS"
//   ) {
//     next(new Error("Only SUBSCRIBERS type can have subscribers"));
//   } else {
//     next();
//   }
// });

CustomerSchema.plugin(mongoosePaginate);

module.exports = mongoose.model("Customer", CustomerSchema);
