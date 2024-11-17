const express = require("express");
const axios = require("axios");
const bodyParser = require("body-parser");
const cors = require("cors");

require("dotenv").config();

const app = express();
const PORT = 5000;


app.use(cors());
app.use(bodyParser.json());

app.post("/subscribe", async (req, res) => {
  const { email,fname,lname } = req.body;

  const apiKey = process.env.MAILCHIMP_API_KEY;
  const audienceId = process.env.MAILCHIMP_AUDIENCE_ID;
  const url = `https://us8.api.mailchimp.com/3.0/lists/${audienceId}/members`;

  const data = {
    email_address: email,
    merge_fields: {
      FNAME: fname,
      LNAME: lname
  },
    status: "subscribed",
  };
  const jsonData = JSON.stringify(data)
  const authHeader = `Basic ${Buffer.from(`anystring:${apiKey}`).toString(
    "base64"
  )}`;

  try {
    await axios.post(url, jsonData, {
      headers: {
        Authorization: authHeader,
      },
    });
    res.status(200).json({ message: "Successfully subscribed!" });
  } catch (error) {
    res.status(400).json({ error: "Error subscribing user" });
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
