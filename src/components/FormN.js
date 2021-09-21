import React from "react";
import Box from "@material-ui/core/Box";
import FormGroup from "@material-ui/core/FormGroup";
import FormControl from "@material-ui/core/FormControl";
import Avatar from "@material-ui/core/Avatar";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  avatar: {
    height: theme.spacing(8),
    width: theme.spacing(8),
  },
  form: {
    alignItems: "center",
  },
}));

export default ({ children, ...props }) => {
  const classes = useStyles();
  return (
    <Box display="flex" flexDirection="column" alignItems="center">
      <Box fontSize="h4.fontSize" mt={3} textAlign="center">
        {props.title}
      </Box>
      <Box fontSize={"body.fontSize"} mt={1} mb={3} textAlign={"center"}>
        {props.text}
      </Box>
      <Box mb={3}>
        <Avatar className={classes.avatar}>{props.icon}</Avatar>
      </Box>
      <FormGroup className={classes.form}>
        {typeof children === "array"
          ? children.map((child) => <FormControl>{child}</FormControl>)
          : children}
      </FormGroup>
      <Box my={1} width={"210px"} display="flex" justifyContent="space-between">
        {props.buttonLeft}
        {props.buttonRight}
      </Box>
    </Box>
  );
};
