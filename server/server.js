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
    const [{ groups }, allMatches] = await Promise.all([
      fetch(
        "https://raw.githubusercontent.com/openfootball/world-cup.json/master/2018/worldcup.standings.json"
      ).then(res => res.json()),
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

    const standingsWithTransformedPoints = groups.map(standing => {
      let insideStandings = standing.standings.map(groups => {
        let newPts = groups.pts;
        if (
          bottom16[groups.team.name] === "first" ||
          top16[groups.team.name] === "first"
        ) {
          newPts += 3;
        }
        if (
          bottom16[groups.team.name] === "second" ||
          top16[groups.team.name] === "second"
        ) {
          newPts += 2;
        }
        if (round16Winners.includes(groups.team.name)) {
          newPts += 4;
        }
        if (quarterFinalWinners.includes(groups.team.name)) {
          newPts += 5;
        }
        if (semiFinalWinners.includes(groups.team.name)) {
          newPts += 6;
        }
        if (thirdAndFourthWinner.includes(groups.team.name)) {
          newPts += 5;
        }
        if (secondPlace.includes(groups.team.name)) {
          newPts += 6;
        }
        if (finalWinner.includes(groups.team.name)) {
          newPts += 8;
        }
        if (bottom16[groups.team.name]) {
          newPts = newPts * 2;
        }
        return { ...groups, newPts };
      });
      return insideStandings;
    });

    // const testCase = standingsWithTransformedPoints.map(whole => {
    //   let firstLayer = whole.map(groups => groups.team.name);
    //   return firstLayer;
    // });

    // const profilesWithPoints = profiles.map(profile => {
    //   const { topTeam, bottomTeam } = profile;
    //   const topTeamStats = standingsWithTransformedPoints.find(
    //     (entireSet => {
    //       let placeHolder = entireSet.map(whole => {
    //         let firstLayer = whole.map(groups.team.name);
    //         return firstLayer;
    //       });
    //       return placeHolder;
    //     }) === topTeam
    //   );

    //   const topPoints = topTeamStats.map(groupLevel => {
    //     let teamLevel = groupLevel.map(team => team.newPts);
    //     return teamLevel;
    //   });
    // const topPlayed = topTeamStats.map(groupLevel => {
    //   let teamLevel = groupLevel.map(team => team.played);
    //   return teamLevel;
    // });
    // const bottomTeamStats = standingsWithTransformedPoints.find(
    //   firstLayer => firstLayer.map(name => name.team.name) === bottomTeam
    // );

    // const bottomPoints = bottomTeamStats.map(groupLevel => {
    //   let teamLevel = groupLevel.map(team => team.newPts);
    //   return teamLevel;
    // });
    // const bottomPlayed = bottomTeamStats.map(groupLevel => {
    //   let teamLevel = groupLevel.map(team => team.played);
    //   return teamLevel;
    // });

    // return {
    //   ...profile,
    //   totalPoints: topPoints + bottomPoints,
    //   played: topPlayed + bottomPlayed,
    //   topTeamStats,
    //   bottomTeamStats
    // };

    //   return {
    //     ...profile,
    //     totalPoints: topPoints,
    //     topTeamStats
    //   };
    // });

    // res.send(profilesWithPoints.sort((a, b) => b.totalPoints - a.totalPoints));
    res.send(standingsWithTransformedPoints);
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
