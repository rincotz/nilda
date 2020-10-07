import React, { useState } from "react";
import { connect } from "react-redux";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import Login from "../Login";
import Drawer from "./Drawer";
import { authenticate, logout } from "../actions";

const Navbar = ({ user, logout, authenticate }) => {
  const [loginOpen, setLoginOpen] = useState(false);
  return (
    <Box width={1} display={"flex"}>
      <Box width={1 / 2}>
        <Drawer user={user} />
      </Box>

      <Box width={1 / 2} display={"flex"} justifyContent="flex-end">
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
