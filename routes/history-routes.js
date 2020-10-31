const express = require("express");
const router = express.Router();
const { handler }  = require('../src/handlers/history-handler');

// GET request is made to /history.
router.get("/", async (req, res) => {

    // process the request using the history-handler method.
    const resp = await handler(req);
    return res.status(resp.statusCode).json(resp);
});

module.exports = router;