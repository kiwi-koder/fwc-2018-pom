import React from "react";
import { withStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import moment from "moment";
import WithLoading from "./../../hoc/WithLoading";

const styles = theme => ({
    root: theme.mixins.gutters({
        paddingTop: 16,
        paddingBottom: 16,
        marginTop: theme.spacing.unit * 3,
        marginBottom: theme.spacing.unit * 3
    }),
    table: {
        width: "100%",
        textAlign: "center",
        fontSize: "18px",

        tableLayout: "fixed"
        // marginTop: "30px"
    },
    match: {
        backgroundColor: theme.palette.background.default,
        border: "1px solid grey",
        padding: "5px",
        marginBottom: "5px"
    }
});

const Div = ({ children }) => <div>{children}</div>;
const DivWithLoading = WithLoading(Div);
const getLocalTime = (date, time, timezone) => {
    timezone = `+0${timezone.split("+")[1]}00`;

    const theirTime = moment(`${date} ${time} ${timezone}`);
    const myTime = theirTime.local().calendar();
    return myTime;
};

const TodaysMatches = ({
    classes,
    matchDay,
    matches,
    isLoading,
    noMatches
}) => {
    return (
        <Paper className={classes.root} elevation={4}>
            <DivWithLoading isLoading={isLoading}>
                <Typography variant="headline" component="h3">
                    {noMatches ? "No matches today sorry!" : { matchDay }}
                </Typography>
                {matches &&
                    !noMatches &&
                    matches
                        .sort((a, b) =>
                            moment(`${a.date} ${a.time}`).diff(
                                moment(`${b.date} ${b.time}`),
                                "hours"
                            )
                        )
                        .map((match, i) => {
                            return (
                                <div key={i} className={classes.match}>
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
            </DivWithLoading>
        </Paper>
    );
};
export default withStyles(styles)(TodaysMatches);
