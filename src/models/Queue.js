const mongoose = require("mongoose");
const AutoIncrement = require("mongoose-sequence")(mongoose);

const QueueSchema = new mongoose.Schema({
  number: { type: Number },
  status: { type: String, default: "waiting" },
  createdAt: { type: Date, default: Date.now() },
  startedAt: { type: Date },
  endedAt: { type: Date },
  departament: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Departament",
    default: null
  }
});

QueueSchema.plugin(AutoIncrement, {
  id: "number_seq",
  inc_field: "number",
  reference_fields: ["departament._id"]
});

const Queue = mongoose.model("Queue", QueueSchema);
