import React from "react";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import { withStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";

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
        height: 550,
        marginTop: theme.spacing.unit * 3,
        overflow: "auto"
    },
    table: {
        minWidth: 700,
        fixedHeader: true
    },
    row: {
        "&:nth-of-type(odd)": {
            backgroundColor: "blue"
        }
    }
});

const Leaderboard = ({ profiles, classes }) => {
    return profiles ? (
        <Paper className={classes.root}>
            <Table className={classes.table}>
                <TableHead>
                    <TableRow>
                        <CustomTableCell>Rank</CustomTableCell>
                        <CustomTableCell>Name</CustomTableCell>
                        <CustomTableCell>Top Team</CustomTableCell>
                        <CustomTableCell>Bottom Team</CustomTableCell>
                        <CustomTableCell>Total Points</CustomTableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {profiles.map((profile, index) => {
                        return (
                            <TableRow key={index}>
                                <CustomTableCell>{index + 1}</CustomTableCell>
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
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>
        </Paper>
    ) : (
        <div />
    );
};

export default withStyles(styles)(Leaderboard);