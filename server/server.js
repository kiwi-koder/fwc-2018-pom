const express = require("express");
const fetch = require("node-fetch");
const path = require("path");

const app = express();
const port = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, "..", "public")));

app.listen(port, () => {
    console.log(`Listening on port ${port}.`);
});

app.get("/latest_scores", async (req, res) => {
    try {
        const { rounds } = await fetch(
            "https://raw.githubusercontent.com/openfootball/world-cup.json/master/2018/worldcup.json"
        ).then(res => res.json());
        res.send(rounds);
    } catch (e) {
        res.status(400).send(e);
    }
});
