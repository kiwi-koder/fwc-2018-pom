const express = require("express");
const moment = require("moment");
const fetch = require("node-fetch");
const path = require("path");
const { profiles } = require("./data/profiles.json");
const app = express();
const port = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, "..", "public")));

app.listen(port, () => {
  console.log(`Listening on port ${port}.`);
});

app.get("/latest_scores", async (req, res) => {
  try {
    const { groups } = await fetch(
      "https://raw.githubusercontent.com/openfootball/world-cup.json/master/2018/worldcup.standings.json"
    ).then(res => res.json());

    let standings = [];
    groups.forEach(group => {
      standings = [...standings, ...group.standings];
    });

    const bottom16 = {
      Russia: 1,
      Egypt: 1,
      "Saudi Arabia": 1,
      Iran: 1,
      Morocco: 1,
      Australia: 1,
      Iceland: 1,
      Nigeria: 1,
      Serbia: 1,
      "Costa Rica": 1,
      Sweden: 1,
      "South Korea": 1,
      Tunisia: 1,
      Panama: 1,
      Senegal: 1,
      Japan: 1
    };

    const standingsWithTransformedPoints = standings.map(standing => {
      if (bottom16[standing.team.name] === 1) {
        const newPts = standing.pts * 2;
        return { ...standing, newPts };
      }
      return { ...standing, newPts: standing.pts };
    });
    const profilesWithPoints = profiles.map(profile => {
      const { topTeam, bottomTeam } = profile;
      const topPoints = standingsWithTransformedPoints.find(
        team => team.team.name === topTeam
      ).newPts;
      const bottomPoints = standingsWithTransformedPoints.find(
        team => team.team.name === bottomTeam
      ).newPts;
      console.log(standingsWithTransformedPoints);
      return {
        ...profile,
        totalPoints: topPoints + bottomPoints
      };
    });
    // res.send(
    //     standingsWithTransformedPoints.sort((a, b) => b.newPts - a.newPts)
    // );

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
          return profile.bottomTeam === team2 || profile.bottomTeam === team2;
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

//this is code
