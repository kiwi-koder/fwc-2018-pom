import React, { Component } from "react";
import Leaderboard from "./components/Leaderboard/index.js";
import TodaysMatches from "./components/TodaysMatches/index.js";

import "./App.css";

class App extends Component {
    state = {
        profiles: undefined,
        matchDay: undefined,
        matches: undefined,
        leaderboardLoading: true,
        matchesLoading: true,
        noMatches: false
    };

    componentDidMount() {
        this.callApi("/latest_scores")
            .then(res => {
                this.setState({ profiles: res, leaderboardLoading: false });
            })
            .catch(err => console.log(err));
        this.callApi("/todays_matches")
            .then(res => {
                this.setState({
                    matchDay: res.name,
                    matches: res.matches,
                    matchesLoading: false
                });
            })
            .catch(err =>
                this.setState({
                    matchesLoading: false,
                    noMatches: true
                })
            );
    }

    callApi = async route => {
        const response = await fetch(route);
        const body = await response.json();

        if (response.status !== 200) throw Error(body.message);

        return body;
    };

    render() {
        console.log(this.state.leaderboardLoading);
        return (
            <div className="App">
                <header className="App-header">
                    <h1 className="App-title">Pomerol Fifa Leaderboard</h1>
                    <h2 className="App-subheader">
                        Follow your team at the official{" "}
                        <a
                            href=" https://www.fifa.com/worldcup/"
                            className="web-link"
                        >
                            Fifa World Cup Page
                        </a>
                    </h2>
                </header>
                <div className="App-intro">
                    <Leaderboard
                        profiles={this.state.profiles}
                        isLoading={this.state.leaderboardLoading}
                    />
                    <TodaysMatches
                        matchDay={this.state.matchDay}
                        matches={this.state.matches}
                        isLoading={this.state.matchesLoading}
                        noMatches={this.state.noMatches}
                    />
                </div>
            </div>
        );
    }
}

export default App;
