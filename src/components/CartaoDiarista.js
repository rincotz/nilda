import React from "react";
import Box from "@material-ui/core/Box";
import IconButton from "@material-ui/core/IconButton";
import CheckIcon from "@material-ui/icons/CheckCircle";
import SvgIcon from "@material-ui/core/SvgIcon";
import LaundryIcon from "@material-ui/icons/LocalLaundryService";
import makeStyles from "@material-ui/core/styles/makeStyles";
import { capitalizeFirstLetter, getAge } from "../utils/utils";
import Avatar from "@material-ui/core/Avatar";

const useStyles = makeStyles((theme) => ({
  avatar: {
    marginLeft: theme.spacing(1),
    marginTop: "auto",
    marginBottom: "auto",
    width: theme.spacing(8),
    height: theme.spacing(8),
  },
  icon: {
    marginRight: theme.spacing(1),
    marginTop: theme.spacing(1),
    fontSize: "1.5rem",
  },
}));

export default (props) => {
  const classes = useStyles();
  const { worker } = props;

  return (
    <Box boxShadow={2} display={"flex"} m={1} mx={1} borderRadius={16}>
      <Avatar
        className={classes.avatar}
        src={worker.foto || ""}
        title={worker.nome}
      />
      <Box
        m={2}
        display={"flex"}
        flexDirection={"column"}
        justifyContent={"space-between"}
        flexGrow={1}
      >
        <Box fontSize={"h6.fontSize"}>
          {capitalizeFirstLetter(worker.nome).split(" ")[0]},{" "}
          {getAge(worker.nascimentoDDMMAAAA)}
        </Box>
        <Box display={"flex"}>
          <SvgIcon
            className={classes.icon}
            aria-label={"faxina"}
            titleAccess={"faxina"}
            color={worker.faxinar ? "primary" : "disabled"}
          >
            <path
              d={
                "M16,11h-1V3c0-1.1-0.9-2-2-2h-2C9.9,1,9,1.9,9,3v8H8c-2.76,0-5,2.24-5,5v7h18v-7C21,13.24,18.76,11,16,11z M19,21h-2v-3 c0-0.55-0.45-1-1-1s-1,0.45-1,1v3h-2v-3c0-0.55-0.45-1-1-1s-1,0.45-1,1v3H9v-3c0-0.55-0.45-1-1-1s-1,0.45-1,1v3H5v-5 c0-1.65,1.35-3,3-3h8c1.65,0,3,1.35,3,3V21z"
              }
            />
          </SvgIcon>
          <LaundryIcon
            className={classes.icon}
            aria-label={"lava roupas"}
            titleAccess={"lava roupas"}
            color={worker.lavarRoupas ? "primary" : "disabled"}
          />
          <SvgIcon
            className={classes.icon}
            aria-label={"passa roupas"}
            titleAccess={"passa roupas"}
            color={worker.passarRoupas ? "primary" : "disabled"}
          >
            <path
              d={
                "M21.6,18.2L13,11.75v-0.91c1.65-0.49,2.8-2.17,2.43-4.05c-0.26-1.31-1.3-2.4-2.61-2.7C10.54,3.57,8.5,5.3,8.5,7.5h2 C10.5,6.67,11.17,6,12,6s1.5,0.67,1.5,1.5c0,0.84-0.69,1.52-1.53,1.5C11.43,8.99,11,9.45,11,9.99v1.76L2.4,18.2 C1.63,18.78,2.04,20,3,20h9h9C21.96,20,22.37,18.78,21.6,18.2z M6,18l6-4.5l6,4.5H6z"
              }
            />
          </SvgIcon>
        </Box>
      </Box>
      <Box
        display={"flex"}
        flexDirection={"column"}
        flexShrink={1}
        justifyContent={"space-evenly"}
        alignItems={"flex-end"}
        mr={1}
      >
        <Box fontSize={"0.9rem"} mr={2}>
          {props.distance.toPrecision(2)}km
        </Box>
        <IconButton
          disabled={props.blockButtons}
          aria-label={"aceitar diarista"}
          color={"secondary"}
          onClick={() => {
            props.setBlockButtons();
            props.aceitarDiarista(worker, props.service.sid).then(() => {
              props.agendamentoCompleto(props.service.sid);
              props.setBlockButtons();
            });
          }}
        >
          <CheckIcon />
        </IconButton>
      </Box>
    </Box>
  );
};
