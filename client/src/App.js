import React, { Component } from "react";
import Leaderboard from "./components/Leaderboard/index.js";
import "./App.css";

class App extends Component {
    state = {
        profiles: undefined
    };

    componentDidMount() {
        this.callApi()
            .then(res => {
                console.log(res);
                this.setState({ profiles: res });
            })
            .catch(err => console.log(err));
    }

    callApi = async () => {
        const response = await fetch("/latest_scores");
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
                </div>
            </div>
        );
    }
}

export default App;
