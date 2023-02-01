const express = require("express");
const router = express.Router();
const Invoice = require("../model/invoice_data");
const easyinvoice = require("easyinvoice");
const fs = require("fs");
require("dotenv").config();

router.post("/invoices", async (req, res) => {
  try {
    const invoice = new Invoice(req.body);
    await invoice.save();
    res.status(201).send({ message: "Invoice added successfully" });
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});
var data;
router.get("/invoices", async (req, res) => {
  try {
    const invoices = await Invoice.findOne().sort({ _id: -1 });

    data = {
      customize: {},
      images: {
        // The logo on top of your invoice
        logo: "https://public.easyinvoice.cloud/img/logo_en_original.png",
        // The invoice background
        background: "https://public.easyinvoice.cloud/img/watermark-draft.jpg",
      },
      // Your own data
      sender: {
        company: "Sample Shop Address ",
        address: "Near Minal, J.K Road",
        zip: "462022",
        city: "Bhopal",
        country: "Madhya Pradesh",
        //"custom1": "custom value 1",
        //"custom2": "custom value 2",
        //"custom3": "custom value 3"
      },
      // Your recipient
      client: {
        company: invoices.name,
        address: invoices.address,
        zip: invoices.mobile,
        city: invoices.email,
        country: "Madhya Pradesh",
        // "custom1": "custom value 1",
        // "custom2": "custom value 2",
        // "custom3": "custom value 3"
      },
      information: {
        // Invoice number
        number: invoices._id,
        // Invoice data
        date: invoices.createdAt.toString().split(),
        // Invoice due date
      },
      // The products you would like to see on your invoice
      // Total values are being calculated automatically
      products: [
        {
          quantity: invoices.quantity,
          description: invoices.product,
          "tax-rate": 5,
          price: invoices.price,
        },
      ],
      "bottom-notice": "Kindly pay your invoice within 15 days.",
      settings: {
        currency: "INR",
      },
      // Translate your invoice to your preferred language
      translate: {},
    };

    res.status(200).send(data);

    const attach = await easyinvoice.createInvoice(data);
    await fs.writeFileSync("invoice.pdf", attach.pdf, "base64");
  } catch (error) {
    console.log(error);
  }
});

router.get("/invoices/mail", async (req, res) => {
  try {
    const filepath = "./invoice.pdf";

    const send = require("gmail-send")({
      user: "hackathons.ritesh@gmail.com",
      pass: process.env.pass,
      to: data.client.city,
      subject: "Your Invoice",
      files: [filepath],
    });

    send(
      {
        text: "Here is your invoice for your order. Kindly pay your invoice within 15 days. Thanks for shopping",
      },
      (error, result, fullResult) => {
        if (error) console.error(error);
        console.log(result);
      }
    );
    res.status(201).send({ message: "Mail sent successfully" });
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});

router.delete("/invoices", async (req, res) => {
  try {
    await Invoice.deleteMany();
    res.status(201).send({ message: "Invoice deleted successfully" });
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});

module.exports = router;
