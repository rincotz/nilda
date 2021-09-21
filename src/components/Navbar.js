import React, { useState } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import Login from "./Login";
import Drawer from "./Drawer";
import { login, startLogout } from "../actions/auth";

const Navbar = ({ auth, logout, login, location }) => {
  const [loginOpen, setLoginOpen] = useState(false);
  return (
    <Box width={1} display={"flex"}>
      <Box width={1 / 3}>
        <Drawer auth={auth} />
      </Box>
      <Box width={1 / 3} display={"flex"} justifyContent={"center"}>
        {location.pathname !== "/" && (
          <Link to={"/"} style={{ textDecoration: "none", color: "inherit" }}>
            <Typography variant={"h4"}>NILDA</Typography>
          </Link>
        )}
      </Box>
      <Box
        width={1 / 3}
        display={"flex"}
        justifyContent="flex-end"
        alignItems={"flex-end"}
      >
        <Button
          onClick={() => (auth.uid ? logout() : setLoginOpen(true))}
          color={"secondary"}
        >
          {auth.uid ? "sair" : "entrar"}
        </Button>
        <Login
          open={loginOpen}
          close={() => setLoginOpen(false)}
          login={login}
          user={auth}
        />
      </Box>
    </Box>
  );
};

const mapStateToProps = ({ auth }) => ({ auth });

const mapDispatchToProps = (dispatch) => ({
  logout: () => dispatch(startLogout()),
  login: (email, password) => dispatch(login(email, password)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Navbar);
