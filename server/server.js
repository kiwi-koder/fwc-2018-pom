const express = require("express");
const fetch = require("node-fetch");
const moment = require("moment");
const path = require("path");
const { profiles } = require("./data/profiles.json");
const bottom16 = require("./data/bottom16.json");
const top16 = require("./data/top16.json");
const app = express();
const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Listening on port ${port}.`);
});

app.get("/latest_scores", async (req, res) => {
  try {
    const [teamScores, allMatches] = await Promise.all([
      fetch("https://worldcup.sfg.io/teams/results").then(res => res.json()),
      fetch("https://worldcup.sfg.io/matches").then(res => res.json())
    ]);

    const round16Winners = allMatches
      .filter(top16 => top16.stage_name == "Round of 16")
      .map(winners => winners.winner);
    const quarterFinalWinners = allMatches
      .filter(top8 => top8.stage_name == "Quarter-finals")
      .map(winners => winners.winner);
    const semiFinalWinners = allMatches
      .filter(top4 => top4.stage_name == "Semi-finals")
      .map(winners => winners.winner);
    const finalWinner = allMatches
      .filter(top2 => top2.stage_name == "Final")
      .map(winners => winners.winner);

    const thirdAndFourthWinner = allMatches
      .filter(top3 => top3.stage_name == "Play-off for third place")
      .map(winner => winner.winner);

    const secondPlace = semiFinalWinners.filter(theTeam => {
      return theTeam !== finalWinner[0];
    });

    const standingsWithTransformedPoints = teamScores.map(teamScore => {
      let newPts = teamScore.points;
      if (
        bottom16[teamScore.country] === "first" ||
        top16[teamScore.country] === "first"
      ) {
        newPts += 3;
      }
      if (
        bottom16[teamScore.country] === "second" ||
        top16[teamScore.country] === "second"
      ) {
        newPts += 2;
      }
      if (round16Winners.includes(teamScore.country)) {
        newPts += 4;
      }
      if (quarterFinalWinners.includes(teamScore.country)) {
        newPts += 5;
      }
      if (semiFinalWinners.includes(teamScore.country)) {
        newPts += 6;
      }
      if (thirdAndFourthWinner.includes(teamScore.country)) {
        newPts += 5;
      }
      if (secondPlace.includes(teamScore.country)) {
        newPts += 6;
      }
      if (finalWinner.includes(teamScore.country)) {
        newPts += 8;
      }
      if (bottom16[teamScore.country]) {
        newPts = newPts * 2;
      }
      return { ...teamScore, newPts };
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
    res.send(profilesWithPoints.sort((a, b) => b.totalPoints - a.totalPoints));
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
          return profile.topTeam === team1 || profile.bottomTeam === team1;
        })
        .map(profile => profile.name);
      const team2Employees = profiles
        .filter(profile => {
          return profile.topTeam === team2 || profile.bottomTeam === team2;
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
    res.sendFile(path.join(__dirname, "..", "client", "build", "index.html"));
  });
}
