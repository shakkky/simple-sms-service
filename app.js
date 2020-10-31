const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const smsRoutes = require("./routes/sms-routes");
const numbersRoutes = require("./routes/numbers-routes");
const historyRoutes = require("./routes/history-routes");

/**
 * 
 * Set up local express server to run unit tests.
 * Express will process requests to different routes based on the routes provided below.
 * 
 */

app.use(bodyParser.json());
app.use("/sms", smsRoutes);
app.use("/numbers", numbersRoutes);
app.use("/history", historyRoutes);

app.get("/", (req, res) => {
  return res.json({ test: 'empty' });
});

module.exports = app;