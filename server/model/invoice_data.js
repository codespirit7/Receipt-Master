const mongoose = require("mongoose");

const invoiceSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    mobile: {
      type: Number,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    products: [
      {
        quantity: {
          type: Number,
          required: true,
        },
        description: {
          type: String,
          required: true,
        },
        "tax-rate": {
          type: Number,
          required: true,
        },
        price: {
          type: Number,
          required: true,
        },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Invoice", invoiceSchema);
