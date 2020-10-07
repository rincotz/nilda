import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Box from "@material-ui/core/Box";
import FormIntro from "./components/FormIntro";
import PhotoCameraIcon from "@material-ui/icons/PhotoCamera";

const useStyles = makeStyles((theme) => ({
  input: {
    display: "none",
  },
  nextButton: {
    marginTop: theme.spacing(2),
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
      <FormIntro
        icon={<PhotoCameraIcon style={{ fontSize: "40px" }} />}
        title={"Foto"}
        text={
          "Uma foto ajuda você e sua diarista a se reconhecerem quando se encontrarem. Após adicionar a foto, clique em avançar."
        }
      />
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
            props.addPic({ ...props.user, foto });
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
