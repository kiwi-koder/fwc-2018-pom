import React from "react";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import { withStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import WithLoading from "./../../hoc/WithLoading";

const TableWithLoading = WithLoading(Table);
const CustomTableCell = withStyles(theme => ({
    head: {
        backgroundColor: "#222",
        color: theme.palette.common.white
    },
    body: {
        fontSize: 14
    }
}))(TableCell);

const styles = theme => ({
    root: {
        width: "100%",
        maxHeight: 320,
        marginTop: theme.spacing.unit * 3,
        overflow: "auto"
    },
    table: {
        fixedHeader: true
    },
    row: {
        "&:nth-of-type(odd)": {
            backgroundColor: theme.palette.background.default
        },
        height: 5
    }
});

const Leaderboard = ({ profiles, classes, isLoading }) => {
    return (
        <Paper className={classes.root}>
            <TableWithLoading isLoading={isLoading} className={classes.table}>
                <TableHead>
                    <TableRow>
                        <CustomTableCell>Rank</CustomTableCell>
                        <CustomTableCell>Name</CustomTableCell>
                        <CustomTableCell>Top Team</CustomTableCell>
                        <CustomTableCell>Bottom Team</CustomTableCell>
                        <CustomTableCell>Total Points</CustomTableCell>
                        <CustomTableCell>Games Played</CustomTableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {profiles &&
                        profiles.map((profile, index) => {
                            return (
                                <TableRow key={index} className={classes.row}>
                                    <CustomTableCell>
                                        {index + 1}
                                    </CustomTableCell>
                                    <CustomTableCell>
                                        {profile.name}
                                    </CustomTableCell>
                                    <CustomTableCell>
                                        {profile.topTeam}
                                    </CustomTableCell>
                                    <CustomTableCell>
                                        {profile.bottomTeam}
                                    </CustomTableCell>
                                    <CustomTableCell>
                                        {profile.totalPoints}
                                    </CustomTableCell>
                                    <CustomTableCell>
                                        {profile.played}
                                    </CustomTableCell>
                                </TableRow>
                            );
                        })}
                </TableBody>
            </TableWithLoading>
        </Paper>
    );
};

export default withStyles(styles)(Leaderboard);
