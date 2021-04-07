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
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import ErrorIcon from "@material-ui/icons/Error";
import BeachIcon from "@material-ui/icons/BeachAccess";
import { makeStyles } from "@material-ui/styles";
import SvgIcon from "@material-ui/core/SvgIcon";

const useStyles = makeStyles((theme) => ({
  large: {
    width: theme.spacing(9),
    height: theme.spacing(9),
  },
}));

export default ({ user }) => {
  const nome = user.displayName ? user.displayName.split(" ")[1] : "";
  const atividade = user.displayName ? user.displayName.split(" ")[0] : "";
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const capitalizeFirstLetter = (str) =>
    `${str.slice(0, 1).toUpperCase()}${str.slice(1)}`;
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
              <ListItemText primary={capitalizeFirstLetter(nome)} />
            </ListItem>
          </List>
          <Divider />
          <List>
            <ListItem button component={Link} to={"/editar"}>
              <ListItemIcon>
                <AccountCircleIcon color={"primary"} />
              </ListItemIcon>
              <ListItemText primary={"Atualizar Cadastro"} />
            </ListItem>
            <ListItem
              button
              component={Link}
              to={user.atividade === "diarista" ? "/diarias" : "/contratacoes"}
            >
              <ListItemIcon>
                <SvgIcon color={"primary"}>
                  <path
                    d={
                      "M16,11h-1V3c0-1.1-0.9-2-2-2h-2C9.9,1,9,1.9,9,3v8H8c-2.76,0-5,2.24-5,5v7h18v-7C21,13.24,18.76,11,16,11z M19,21h-2v-3 c0-0.55-0.45-1-1-1s-1,0.45-1,1v3h-2v-3c0-0.55-0.45-1-1-1s-1,0.45-1,1v3H9v-3c0-0.55-0.45-1-1-1s-1,0.45-1,1v3H5v-5 c0-1.65,1.35-3,3-3h8c1.65,0,3,1.35,3,3V21z"
                    }
                  />
                </SvgIcon>
              </ListItemIcon>
              <ListItemText primary={"Diárias"} />
            </ListItem>
            {atividade === "diarista" && (
              <ListItem button component={Link} to={"/beneficios"}>
                <ListItemIcon>
                  <BeachIcon color={"primary"} />
                </ListItemIcon>
                <ListItemText primary={"Benefícios"} />
              </ListItem>
            )}
            <ListItem button component={Link} to={"/ocorrencias"}>
              <ListItemIcon>
                <ErrorIcon color={"primary"} />
              </ListItemIcon>
              <ListItemText primary={"Ocorrências"} />
            </ListItem>
          </List>
        </Box>
      </SwipeableDrawer>
    </Box>
  );
};
