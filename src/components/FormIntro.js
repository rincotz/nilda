import React from "react";
import Box from "@material-ui/core/Box";
import Avatar from "@material-ui/core/Avatar";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  avatar: {
    height: theme.spacing(8),
    width: theme.spacing(8),
  },
}));

export default (props) => {
  const classes = useStyles();
  return (
    <Box
      display={"flex"}
      flexDirection={"column"}
      justifyContent={"center"}
      alignItems={"center"}
    >
      <Box fontSize={"h4.fontSize"} mt={3} textAlign={"center"}>
        {props.title}
      </Box>
      {props.text && (
        <Box fontSize={"body.fontSize"} mt={1} mb={3} textAlign={"center"}>
          {props.text}
        </Box>
      )}
      {props.icon && (
        <Box mb={3}>
          <Avatar className={classes.avatar}>{props.icon}</Avatar>
        </Box>
      )}
    </Box>
  );
};
