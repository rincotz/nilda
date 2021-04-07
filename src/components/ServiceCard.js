import React, { useState } from "react";
import Box from "@material-ui/core/Box";
import Collapse from "@material-ui/core/Collapse";
import CardMedia from "@material-ui/core/CardMedia";
import IconButton from "@material-ui/core/IconButton";
import CheckIcon from "@material-ui/icons/CheckCircle";
import SvgIcon from "@material-ui/core/SvgIcon";
import LaundryIcon from "@material-ui/icons/LocalLaundryService";
import UpdateIcon from "@material-ui/icons/Update";
import AlarmIcon from "@material-ui/icons/Alarm";
import HomeIcon from "@material-ui/icons/Home";
import StoreIcon from "@material-ui/icons/Store";
import FaceIcon from "@material-ui/icons/Face";
import ExpandIcon from "@material-ui/icons/ExpandMore";
import makeStyles from "@material-ui/core/styles/makeStyles";
import moment from "moment";
import LocationIcon from "@material-ui/icons/Room";
import Typography from "@material-ui/core/Typography";

moment.locale("br");

const useStyles = makeStyles((theme) => ({
  foto: {
    width: "5.5rem",
  },
  icon: {
    marginRight: "2px",
  },
  card: {
    [theme.breakpoints.down("sm")]: {
      width: "17rem",
    },
    [theme.breakpoints.up("sm")]: {
      width: "25rem",
    },
  },
  distance: {
    marginTop: "0.5rem",
    marginRight: "0.5rem",
  },
  expand: {
    width: "100%",
    transform: "rotate(0deg)",
    transition: theme.transitions.create("transform", {
      duration: theme.transitions.duration.shortest,
    }),
  },
  expanded: {
    width: "100%",
    transform: "rotate(180deg)",
    transition: theme.transitions.create("transform", {
      duration: theme.transitions.duration.shortest,
    }),
  },
}));

export default (props) => {
  const [expanded, setExpanded] = useState(false);
  const classes = useStyles();
  const service = props.service;
  const capitalizeFirstLetter = (str) =>
    `${str.slice(0, 1).toUpperCase()}${str.slice(1)}`;
  const firstName = (str) => str.split(" ", 1);
  const getAge = (birthDate) =>
    moment().diff(moment(birthDate, "DDMMYYYY"), "years", false);
  const getPeriodicity = (numeroDiariasEm4Semanas) => {
    switch (numeroDiariasEm4Semanas) {
      case 1:
        return "mensal";
      case 2:
        return "quinzenal";
      case 4:
        return "semanal";
    }
  };
  const getIcon = (workPlaceType) => {
    switch (workPlaceType) {
      case "apartamento":
        return (
          <SvgIcon className={classes.icon} fontSize={"small"}>
            <path
              d={
                "M17,11V3H7v4H3v14h8v-4h2v4h8V11H17z M7,19H5v-2h2V19z M7,15H5v-2h2V15z M7,11H5V9h2V11z M11,15H9v-2h2V15z M11,11H9V9h2 V11z M11,7H9V5h2V7z M15,15h-2v-2h2V15z M15,11h-2V9h2V11z M15,7h-2V5h2V7z M19,19h-2v-2h2V19z M19,15h-2v-2h2V15z"
              }
            />
          </SvgIcon>
        );
      case "casa":
        return <HomeIcon className={classes.icon} fontSize={"small"} />;
      case "comercial":
        return <StoreIcon className={classes.icon} fontSize={"small"} />;
    }
  };

  return (
    <Box
      className={classes.card}
      boxShadow={2}
      display={"flex"}
      flexWrap={"wrap"}
    >
      <CardMedia
        className={classes.foto}
        image={service.foto || ""}
        title={service.nome}
      />
      <Box display={"flex"} flexGrow={1}>
        <Box
          display={"flex"}
          flexDirection={"column"}
          justifyContent={"space-evenly"}
          mx={"auto"}
          my={1}
        >
          <Typography variant={"subtitle1"}>
            {firstName(capitalizeFirstLetter(service.nome))},{" "}
            {getAge(service.nascimentoDDMMAAAA)}
          </Typography>
          <Box display={"flex"} alignItems={"center"}>
            <LocationIcon fontSize={"small"} className={classes.icon} />
            <Typography variant={"body2"}>
              {capitalizeFirstLetter(service.endereco.bairro)}
            </Typography>
          </Box>
          <Box display={{ xs: "flex", md: "none" }} alignItems={"center"}>
            <AlarmIcon fontSize={"small"} className={classes.icon} />
            <Typography variant={"body2"}>
              {`${service.horaAgendada}:${service.minAgendado}-${
                service.horaAgendada + 9
              }:${service.minAgendado}`}
            </Typography>
          </Box>
          <Box
            display={{ xs: "none", md: "flex" }}
            justifyContent={"space-evenly"}
          >
            <SvgIcon
              className={classes.icon}
              aria-label={"faxinar"}
              titleAccess={"faxinar"}
              fontSize={"small"}
              color={service.faxinar ? "inherit" : "disabled"}
            >
              <path
                d={
                  "M16,11h-1V3c0-1.1-0.9-2-2-2h-2C9.9,1,9,1.9,9,3v8H8c-2.76,0-5,2.24-5,5v7h18v-7C21,13.24,18.76,11,16,11z M19,21h-2v-3 c0-0.55-0.45-1-1-1s-1,0.45-1,1v3h-2v-3c0-0.55-0.45-1-1-1s-1,0.45-1,1v3H9v-3c0-0.55-0.45-1-1-1s-1,0.45-1,1v3H5v-5 c0-1.65,1.35-3,3-3h8c1.65,0,3,1.35,3,3V21z"
                }
              />
            </SvgIcon>
            <LaundryIcon
              className={classes.icon}
              aria-label={"lavar roupas"}
              titleAccess={"lavar roupas"}
              fontSize={"small"}
              color={service.lavarRoupas ? "inherit" : "disabled"}
            />
            <SvgIcon
              className={classes.icon}
              aria-label={"passar roupas"}
              titleAccess={"passar roupas"}
              fontSize={"small"}
              color={service.passarRoupas ? "inherit" : "disabled"}
            >
              <path
                d={
                  "M21.6,18.2L13,11.75v-0.91c1.65-0.49,2.8-2.17,2.43-4.05c-0.26-1.31-1.3-2.4-2.61-2.7C10.54,3.57,8.5,5.3,8.5,7.5h2 C10.5,6.67,11.17,6,12,6s1.5,0.67,1.5,1.5c0,0.84-0.69,1.52-1.53,1.5C11.43,8.99,11,9.45,11,9.99v1.76L2.4,18.2 C1.63,18.78,2.04,20,3,20h9h9C21.96,20,22.37,18.78,21.6,18.2z M6,18l6-4.5l6,4.5H6z"
                }
              />
            </SvgIcon>
          </Box>
          <Box display={{ xs: "flex", md: "none" }} justifyContent={"center"}>
            <IconButton
              aria-label={"mostrar mais"}
              size={"small"}
              onClick={() => setExpanded(!expanded)}
              className={expanded ? classes.expanded : classes.expand}
            >
              <ExpandIcon />
            </IconButton>
          </Box>
        </Box>
        <Box
          display={{ xs: "none", sm: "none", md: "flex" }}
          flexDirection={"column"}
          mx={"auto"}
          my={1}
        >
          <Box display={"flex"} alignItems={"center"}>
            <FaceIcon fontSize={"small"} className={classes.icon} />
            <Typography variant={"body2"}>
              {`${service.numeroDeMoradores} moradores`}
            </Typography>
          </Box>
          <Box display={"flex"} alignItems={"center"}>
            {getIcon(service.tipoDeHabitacao)}
            <Typography variant={"body2"}>
              {`${service.numeroDeComodos} cômodos`}
            </Typography>
          </Box>
          <Box display={{ xs: "none", md: "flex" }} alignItems={"center"}>
            <AlarmIcon fontSize={"small"} className={classes.icon} />
            <Typography variant={"body2"}>
              {`${service.horaAgendada}:${service.minAgendado}-${
                service.horaAgendada + 9
              }:${service.minAgendado}`}
            </Typography>
          </Box>
          <Box display={"flex"} alignItems={"center"}>
            <UpdateIcon fontSize={"small"} className={classes.icon} />
            <Typography variant={"body2"}>
              {getPeriodicity(service.numeroDiariasEm4Semanas)}
            </Typography>
          </Box>
        </Box>
        <Box
          display={"flex"}
          flexDirection={"column"}
          justifyContent={"space-between"}
          alignItems={"center"}
          order={3}
        >
          <Typography variant={"body2"} className={classes.distance}>
            {service.distance.toPrecision(2)}km
          </Typography>
          <IconButton
            aria-label={"aceitar serviço"}
            color={"secondary"}
            onClick={() => props.aceitarServico(service)}
          >
            <CheckIcon />
          </IconButton>
        </Box>
      </Box>
      <Box className={classes.card} display={{ xs: "box", md: "none" }}>
        <Collapse in={expanded} timeout={"auto"} unmountOnExit>
          <Box
            my={1}
            display={"flex"}
            flexWrap={"wrap"}
            justifyContent={"space-evenly"}
            className={classes.card}
          >
            {service.faxinar && (
              <Box display={"flex"} alignItems={"center"}>
                <SvgIcon
                  className={classes.icon}
                  aria-label={"faxina"}
                  titleAccess={"faxina"}
                  fontSize={"small"}
                >
                  <path
                    d={
                      "M16,11h-1V3c0-1.1-0.9-2-2-2h-2C9.9,1,9,1.9,9,3v8H8c-2.76,0-5,2.24-5,5v7h18v-7C21,13.24,18.76,11,16,11z M19,21h-2v-3 c0-0.55-0.45-1-1-1s-1,0.45-1,1v3h-2v-3c0-0.55-0.45-1-1-1s-1,0.45-1,1v3H9v-3c0-0.55-0.45-1-1-1s-1,0.45-1,1v3H5v-5 c0-1.65,1.35-3,3-3h8c1.65,0,3,1.35,3,3V21z"
                    }
                  />
                </SvgIcon>
                <Typography variant={"body2"}>faxinar</Typography>
              </Box>
            )}
            {service.lavarRoupas && (
              <Box display={"flex"} alignItems={"center"}>
                <LaundryIcon
                  className={classes.icon}
                  aria-label={"lava roupas"}
                  titleAccess={"lava roupas"}
                  fontSize={"small"}
                />
                <Typography variant={"body2"}>lavar roupas</Typography>
              </Box>
            )}
            {service.passarRoupas && (
              <Box display={"flex"} alignItems={"center"}>
                <SvgIcon
                  className={classes.icon}
                  aria-label={"passa roupas"}
                  titleAccess={"passa roupas"}
                  fontSize={"small"}
                >
                  <path
                    d={
                      "M21.6,18.2L13,11.75v-0.91c1.65-0.49,2.8-2.17,2.43-4.05c-0.26-1.31-1.3-2.4-2.61-2.7C10.54,3.57,8.5,5.3,8.5,7.5h2 C10.5,6.67,11.17,6,12,6s1.5,0.67,1.5,1.5c0,0.84-0.69,1.52-1.53,1.5C11.43,8.99,11,9.45,11,9.99v1.76L2.4,18.2 C1.63,18.78,2.04,20,3,20h9h9C21.96,20,22.37,18.78,21.6,18.2z M6,18l6-4.5l6,4.5H6z"
                    }
                  />
                </SvgIcon>
                <Typography variant={"body2"}>passar roupas</Typography>
              </Box>
            )}
            <Box display={"flex"} alignItems={"center"}>
              <FaceIcon fontSize={"small"} className={classes.icon} />
              <Typography variant={"body2"}>
                {`${service.numeroDeMoradores} moradores`}
              </Typography>
            </Box>
            <Box display={"flex"} alignItems={"center"}>
              {getIcon(service.tipoDeHabitacao)}
              <Typography variant={"body2"}>
                {`${service.numeroDeComodos} cômodos`}
              </Typography>
            </Box>
            <Box display={"flex"} alignItems={"center"}>
              <UpdateIcon fontSize={"small"} className={classes.icon} />
              <Typography variant={"body2"}>
                {getPeriodicity(service.numeroDiariasEm4Semanas)}
              </Typography>
            </Box>
          </Box>
        </Collapse>
      </Box>
    </Box>
  );
};
