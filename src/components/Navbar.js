import React, { useState } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import Login from "../Login";
import Drawer from "./Drawer";
import { authenticate, logout } from "../actions/users";

const Navbar = ({ user, logout, authenticate, location }) => {
  const [loginOpen, setLoginOpen] = useState(false);
  return (
    <Box width={1} display={"flex"} bgcolor={"background.paper"}>
      <Box width={1 / 3}>
        <Drawer user={user} />
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
          onClick={() => (user.uid ? logout() : setLoginOpen(true))}
          color={"secondary"}
        >
          {user.uid ? "sair" : "entrar"}
        </Button>
        <Login
          open={loginOpen}
          close={() => setLoginOpen(false)}
          authenticate={authenticate}
          user={user}
        />
      </Box>
    </Box>
  );
};

const mapStateToProps = (state) => ({ user: state.user });

const mapDispatchToProps = (dispatch) => ({
  logout: () => dispatch(logout()),
  authenticate: (email, password) => dispatch(authenticate(email, password)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Navbar);
