import React from "react";
import { withStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";

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

const TodaysMatches = ({ classes, matchDay, matches }) => {
    return matches ? (
        <div>
            <Paper className={classes.root} elevation={4}>
                <Typography variant="headline" component="h3">
                    {matchDay} - Today's Matches
                </Typography>
                {matches.map((match, i) => {
                    console.log(match);
                    return (
                        <table key={i} className={classes.table}>
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
                    );
                })}
            </Paper>
        </div>
    ) : (
        <div />
    );
};
export default withStyles(styles)(TodaysMatches);
