import React from "react";
import { withStyles } from "@material-ui/core/styles";
import LinearProgress from "@material-ui/core/LinearProgress";

const styles = {
    root: {
        flexGrow: 1
    }
};

const Loading = props => {
    const { classes } = props;
    return (
        <div className={classes.root}>
            <LinearProgress />
            <br />
            <LinearProgress color="secondary" />
        </div>
    );
};

const LoadingWithStyles = withStyles(styles)(Loading);

const WithLoading = Component => {
    return ({ isLoading, ...props }) => {
        return isLoading ? <LoadingWithStyles /> : <Component {...props} />;
    };
};

export default WithLoading;
