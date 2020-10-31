const express = require("express");
const router = express.Router();
const { handler }  = require('../src/handlers/numbers-handler');

// GET request is made to /numbers.
router.get("/", async (req, res) => {

    // process the request using the numbers-handler method.
    const resp = await handler(req);
    return res.status(resp.statusCode).json(resp);
});

module.exports = router;