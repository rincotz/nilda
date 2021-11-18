import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import PhotoCameraIcon from "@material-ui/icons/PhotoCamera";
import Avatar from "@material-ui/core/Avatar";
import FormN from "../components/FormN";
import ButtonN from "../components/ButtonN";

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
    <FormN
      title="Foto"
      text="Uma foto ajuda você e sua diarista a se reconhecerem quando se
        encontrarem. Após adicionar a foto, clique em avançar."
      icon={
        <Avatar className={classes.avatar}>
          <PhotoCameraIcon style={{ fontSize: "40px" }} />
        </Avatar>
      }
      buttonLeft={
        <ButtonN
          color="secondary"
          buttonText="voltar"
          onClick={() => {
            props.stageUser(foto);
            props.previousStep();
          }}
        />
      }
      buttonRight={
        <ButtonN
          color="primary"
          buttonText="avançar"
          disabled={!foto}
          onClick={() => {
            props.storePic(foto).then((url) => {
              props.startStageUser({ foto: url });
              props.nextStep();
            });
          }}
        />
      }
    >
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
    </FormN>
  );
};

export default ProfilePicStep;
