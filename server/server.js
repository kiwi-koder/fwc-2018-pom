const express = require("express");
const fetch = require("node-fetch");
const moment = require("moment");
const path = require("path");
const { profiles } = require("./data/profiles.json");
const bottom16 = require("./data/bottom16.json");
const app = express();
const port = process.env.PORT || 5000;

app.listen(port, () => {
    console.log(`Listening on port ${port}.`);
});

app.get("/latest_scores", async (req, res) => {
    try {
        const teamScores = await fetch(
            "https://worldcup.sfg.io/teams/results"
        ).then(res => res.json());

        let standings = [];

        const standingsWithTransformedPoints = teamScores.map(teamScore => {
            console.log(bottom16);
            if (bottom16[teamScore.country] === 1) {
                const newPts = teamScore.points * 2;
                return { ...teamScore, newPts };
            }
            return { ...teamScore, newPts: teamScore.points };
        });

        const profilesWithPoints = profiles.map(profile => {
            const { topTeam, bottomTeam } = profile;
            const topTeamStats = standingsWithTransformedPoints.find(
                team => team.country === topTeam
            );
            const topPoints = topTeamStats.newPts;
            const topPlayed = topTeamStats.games_played;
            const bottomTeamStats = standingsWithTransformedPoints.find(
                team => team.country === bottomTeam
            );
            const bottomPoints = bottomTeamStats.newPts;
            const bottomPlayed = bottomTeamStats.games_played;
            return {
                ...profile,
                totalPoints: topPoints + bottomPoints,
                played: topPlayed + bottomPlayed,
                topTeamStats,
                bottomTeamStats
            };
        });

        res.send(
            profilesWithPoints.sort((a, b) => b.totalPoints - a.totalPoints)
        );
    } catch (e) {
        res.status(400).send(e);
    }
});

app.get("/todays_matches", async (req, res) => {
    try {
        const { rounds } = await fetch(
            "https://raw.githubusercontent.com/openfootball/world-cup.json/master/2018/worldcup.json"
        ).then(res => res.json());
        let currentDate = moment().format("YYYY-MM-DD");
        const todaysMatches = rounds.find(round => {
            return round.matches[0].date === currentDate;
        });

        const matchesWithNames = todaysMatches.matches.map(match => {
            const team1 = match.team1.name;
            const team2 = match.team2.name;

            const team1Employees = profiles
                .filter(profile => {
                    return (
                        profile.topTeam === team1 ||
                        profile.bottomTeam === team1
                    );
                })
                .map(profile => profile.name);
            const team2Employees = profiles
                .filter(profile => {
                    return (
                        profile.topTeam === team2 ||
                        profile.bottomTeam === team2
                    );
                })
                .map(profile => profile.name);

            return { ...match, team1Employees, team2Employees };
        });
        todaysMatches.matches = matchesWithNames;

        res.send(todaysMatches);
    } catch (e) {
        res.status(400).send(e);
    }
});

if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "..", "client", "build")));
    app.get("*", function(req, res) {
        res.sendFile(
            path.join(__dirname, "..", "client", "build", "index.html")
        );
    });
}
