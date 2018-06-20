import React from "react";
import { withStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import moment from "moment";
const styles = theme => ({
    root: theme.mixins.gutters({
        paddingTop: 16,
        paddingBottom: 16,
        marginTop: theme.spacing.unit * 3
    }),
    table: {
        width: "100%",
        textAlign: "center",
        tableLayout: "fixed",
        marginTop: "30px"
    }
});

const getLocalTime = (date, time, timezone) => {
    timezone = `+0${timezone.split("+")[1]}00`;

    const theirTime = moment(`${date} ${time} ${timezone}`);
    const myTime = theirTime.local().calendar();
    return myTime;
};

const TodaysMatches = ({ classes, matchDay, matches }) => {
    console.log(matches);
    return matches ? (
        <div>
            <Paper className={classes.root} elevation={4}>
                <Typography variant="headline" component="h3">
                    {matchDay} - Today's Matches
                </Typography>
                {matches
                    .sort((a, b) =>
                        moment(`${a.date} ${a.time}`).diff(
                            moment(`${b.date} ${b.time}`),
                            "hours"
                        )
                    )
                    .map((match, i) => {
                        console.log(match);
                        return (
                            <div key={i}>
                                <table className={classes.table}>
                                    <thead>
                                        <tr>
                                            <th>{match.team1.name}</th>

                                            <th>VS.</th>

                                            <th>{match.team2.name}</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>
                                                {match.team1Employees.map(
                                                    (employee, i) => {
                                                        return (
                                                            <div key={i}>
                                                                {employee}
                                                            </div>
                                                        );
                                                    }
                                                )}
                                            </td>
                                            <td />
                                            <td>
                                                {match.team2Employees.map(
                                                    (employee, i) => {
                                                        return (
                                                            <div key={i}>
                                                                {employee}
                                                            </div>
                                                        );
                                                    }
                                                )}
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                                <div>
                                    {getLocalTime(
                                        match.date,
                                        match.time,
                                        match.timezone
                                    )}
                                </div>
                            </div>
                        );
                    })}
            </Paper>
        </div>
    ) : (
        <div />
    );
};
export default withStyles(styles)(TodaysMatches);
