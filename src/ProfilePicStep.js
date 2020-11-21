import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Box from "@material-ui/core/Box";
import PhotoCameraIcon from "@material-ui/icons/PhotoCamera";
import CheckIcon from "@material-ui/icons/CheckCircle";
import Avatar from "@material-ui/core/Avatar";

const useStyles = makeStyles((theme) => ({
  input: {
    display: "none",
  },
  nextButton: {
    marginTop: theme.spacing(2),
  },
  avatar: {
    width: theme.spacing(8),
    height: theme.spacing(8),
  },
}));

export const ProfilePicStep = (props) => {
  const [foto, setFoto] = useState("");
  const classes = useStyles();

  return (
    <Box
      display={"flex"}
      flexDirection={"column"}
      justifyContent={"center"}
      alignItems={"center"}
    >
      <Box fontSize={"h4.fontSize"} mt={3} textAlign={"center"}>
        Foto
      </Box>
      <Box fontSize={"body.fontSize"} mt={1} mb={3} textAlign={"center"}>
        Uma foto ajuda você e sua diarista a se reconhecerem quando se
        encontrarem. Após adicionar a foto, clique em avançar.
      </Box>
      <Box mb={3}>
        <Avatar className={classes.avatar}>
          {foto ? (
            <CheckIcon style={{ fontSize: "60px" }} />
          ) : (
            <PhotoCameraIcon style={{ fontSize: "40px" }} />
          )}
        </Avatar>
      </Box>
      <input
        type="file"
        className={classes.input}
        id="contained-button-file"
        accept="image/*"
        multiple={false}
        onChange={(e) => setFoto(e.target.files[0])}
      />
      <label htmlFor="contained-button-file">
        <Button variant="contained" color={"primary"} component="span">
          Adicionar Foto
        </Button>
      </label>
      <Button
        className={classes.nextButton}
        variant="text"
        color={"secondary"}
        onClick={() => {
          props.nextStep();
          if (foto) {
            props.addPic({
              ...props.user,
              pessoais: { ...props.user.pessoais, foto: foto },
            });
          }
        }}
      >
        avançar
      </Button>
    </Box>
  );
};

// ProfilePicStep.propTypes = {
//   nextStep: PropTypes.func.isRequired,
//   addPic: PropTypes.func.isRequired,
//   user: PropTypes.exact({
//     uid: PropTypes.string.isRequired,
//     telefone: PropTypes.string.isRequired,
//     atividade: PropTypes.string.isRequired,
//     nome: PropTypes.string.isRequired,
//     genero: PropTypes.string.isRequired,
//     nascimentoDDMMAAAA: PropTypes.string.isRequired,
//     cpf: PropTypes.string.isRequired,
//     email: PropTypes.string.isRequired,
//     senha: PropTypes.string.isRequired
//   }).isRequired
// }

export default ProfilePicStep;
