import React, { useState } from "react";
import { Link } from "react-router-dom";
import Box from "@material-ui/core/Box";
import SwipeableDrawer from "@material-ui/core/SwipeableDrawer";
import IconButton from "@material-ui/core/IconButton";
import List from "@material-ui/core/List";
import Divider from "@material-ui/core/Divider";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import Avatar from "@material-ui/core/Avatar";
import MenuIcon from "@material-ui/icons/Menu";
import AccountCircle from "@material-ui/icons/AccountCircle";
import Work from "@material-ui/icons/Work";
import Error from "@material-ui/icons/Error";
import { makeStyles } from "@material-ui/styles";

const useStyles = makeStyles((theme) => ({
  large: {
    width: theme.spacing(7),
    height: theme.spacing(7),
  },
}));

export default ({ user }) => {
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  return (
    <Box display={user.uid ? "" : "none"}>
      <IconButton
        onClick={() => setOpen(true)}
        color={"secondary"}
        aria-label={"abrir menu"}
        edge={"end"}
      >
        <MenuIcon />
      </IconButton>
      <SwipeableDrawer
        open={open}
        anchor={"left"}
        onClose={() => setOpen(false)}
        onOpen={() => setOpen(true)}
      >
        <Box pr={3} role={"presentation"}>
          <List>
            <ListItem>
              <ListItemAvatar>
                <Avatar className={classes.large} src={user.photoURL} />
              </ListItemAvatar>
            </ListItem>
            <ListItem>
              <ListItemText
                primary={
                  user.displayName
                    ? user.displayName.split(" ")[2]
                    : "Visitante"
                }
              />
            </ListItem>
          </List>
          <Divider />
          <List>
            <ListItem button component={Link} to={"/editar"}>
              <ListItemIcon>
                <AccountCircle color={"primary"} />
              </ListItemIcon>
              <ListItemText primary={"Atualizar Cadastro"} />
            </ListItem>
            <ListItem button component={Link} to={"/diarias"}>
              <ListItemIcon>
                <Work color={"primary"} />
              </ListItemIcon>
              <ListItemText primary={"Diárias"} />
            </ListItem>
            <ListItem button component={Link} to={"/ocorrencias"}>
              <ListItemIcon>
                <Error color={"primary"} />
              </ListItemIcon>
              <ListItemText primary={"Ocorrências"} />
            </ListItem>
          </List>
        </Box>
      </SwipeableDrawer>
    </Box>
  );
};