import React, { useEffect, useState } from "react";
import Box from "@material-ui/core/Box";
import TextField from "@material-ui/core/TextField";
import OutlinedInput from "@material-ui/core/OutlinedInput";
import IconButton from "@material-ui/core/IconButton";
import InputAdornment from "@material-ui/core/InputAdornment";
import InputLabel from "@material-ui/core/InputLabel";
import Button from "@material-ui/core/Button";
import Modal from "@material-ui/core/Modal";
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";
import { makeStyles } from "@material-ui/styles";

const useStyles = makeStyles((theme) => ({
  loginBox: {
    maxWidth: "32rem",
  },
  input: {
    marginBottom: theme.spacing(1),
  },
  button: {
    marginTop: theme.spacing(1),
  },
}));

export const Login = ({ auth, login, close, open }) => {
  const classes = useStyles();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  return (
    <Box>
      <Modal open={open} onClose={close}>
        <Box
          className={classes.loginBox}
          bgcolor={"background.paper"}
          width={2 / 3}
          display={"flex"}
          flexDirection={"column"}
          alignItens={"center"}
          justifyContent={"center"}
          m={"auto"}
          mt={10}
          p={6}
        >
          <TextField
            className={classes.input}
            variant="outlined"
            onChange={(e) => setEmail(e.target.value)}
            label="email"
            name="email"
            value={email}
          />
          <OutlinedInput
            className={classes.input}
            type={showPassword ? "text" : "password"}
            id="standard-adornment-password"
            variant="outlined"
            onChange={(e) => setPassword(e.target.value)}
            name="senha"
            placeholder="senha"
            value={password}
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  color={"secondary"}
                  aria-label="mostrar/esconder senha"
                  onClick={() => setShowPassword(!showPassword)}
                  onMouseDown={(e) => e.preventDefault()}
                  edge="end"
                >
                  {showPassword ? <Visibility /> : <VisibilityOff />}
                </IconButton>
              </InputAdornment>
            }
          />
          <InputLabel error={true} htmlFor="standard-adornment-password">
            {errorMessage}
          </InputLabel>
          <Button
            className={classes.button}
            color={"primary"}
            variant="outlined"
            onClick={() =>
              login(email, password)
                .then(() => {
                  close();
                  setPassword("");
                })
                .catch((e) => setErrorMessage(e.message))
            }
          >
            entrar
          </Button>
        </Box>
      </Modal>
    </Box>
  );
};

export default Login;
