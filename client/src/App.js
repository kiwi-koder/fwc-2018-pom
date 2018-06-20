import React, { Component } from "react";
import Leaderboard from "./components/Leaderboard/index.js";
import TodaysMatches from "./components/TodaysMatches/index.js";

import "./App.css";

class App extends Component {
    state = {
        profiles: undefined,
        matchDay: undefined,
        matches: undefined
    };

    componentDidMount() {
        this.callApi("/latest_scores")
            .then(res => {
                this.setState({ profiles: res });
            })
            .catch(err => console.log(err));
        this.callApi("/todays_matches")
            .then(res => {
                this.setState({
                    matchDay: res.name,
                    matches: res.matches
                });
            })
            .catch(err => console.log(err));
    }

    callApi = async route => {
        const response = await fetch(route);
        const body = await response.json();

        if (response.status !== 200) throw Error(body.message);

        return body;
    };

    render() {
        return (
            <div className="App">
                <header className="App-header">
                    <h1 className="App-title">Pomerol Fifa Leaderboard</h1>
                </header>
                <div className="App-intro">
                    <Leaderboard profiles={this.state.profiles} />
                    <TodaysMatches
                        matchDay={this.state.matchDay}
                        matches={this.state.matches}
                    />
                </div>
            </div>
        );
    }
}

export default App;
