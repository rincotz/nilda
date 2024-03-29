import React, { Fragment } from "react";
import moment from "moment";
import "moment/locale/pt-br";
import Box from "@material-ui/core/Box";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import Avatar from "@material-ui/core/Avatar";
import IconButton from "@material-ui/core/IconButton";
import CircularProgress from "@material-ui/core/CircularProgress";
import CloseIcon from "@material-ui/icons/Close";
import CalendarIcon from "@material-ui/icons/Event";
import AlarmIcon from "@material-ui/icons/Alarm";
import RestoreIcon from "@material-ui/icons/Restore";
import PersonIcon from "@material-ui/icons/Person";
import SvgIcon from "@material-ui/core/SvgIcon";
import {
  capitalizeFirstLetter,
  getPeriodicity,
  getStatus,
} from "../utils/utils";

moment.locale("pt-br");

// TODO navlink em table rows para levar a informações mais detalhadas sobre o servico

export default ({ atividade, services, loading }) => {
  return loading ? (
    <CircularProgress />
  ) : (
    <Fragment>
      <Box boxShadow={3} display={{ xs: "block", sm: "none" }}>
        <TableContainer component={Paper}>
          <Table
            aria-label={`tabela de ${
              atividade === "diarista" ? "diárias" : "contratações"
            }`}
          >
            <TableHead>
              <TableRow>
                <TableCell>
                  <PersonIcon
                    aria-label={
                      atividade === "diarista" ? "contratante" : "diarista"
                    }
                    titleAccess={
                      atividade === "diarista" ? "contratante" : "diarista"
                    }
                  />
                </TableCell>
                <TableCell>
                  <CalendarIcon
                    aria-label={"agendamento"}
                    titleAccess={"agendamento"}
                  />
                </TableCell>
                <TableCell>
                  <AlarmIcon aria-label={"horário"} titleAccess={"horário"} />
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {services.map((service, index) => {
                const subject =
                  atividade === "contratante" ? service.diarista : service;
                return (
                  <TableRow
                    key={service.sid}
                    /*component={NavLink}
                    to={service.sid}*/
                  >
                    <TableCell>
                      {capitalizeFirstLetter(subject.nome).split(" ")[0]}
                    </TableCell>
                    <TableCell>
                      {`${service.diaAgendado} ${moment(
                        service.agendamento
                      ).format("DD/MM")}`}
                    </TableCell>
                    <TableCell>
                      {`${service.horaAgendada}:${service.minAgendado}h`}
                    </TableCell>
                    <TableCell>
                      <IconButton
                        aria-label={"dispensar diária"}
                        color={"secondary"}
                        onClick={() => {}}
                      >
                        <CloseIcon fontSize={"small"} />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
      <Box boxShadow={3} display={{ xs: "none", sm: "block" }}>
        <TableContainer component={Paper}>
          <Table
            aria-label={`tabela de ${
              atividade === "diarista" ? "diárias" : "contratações"
            }`}
          >
            <TableHead>
              <TableRow>
                <TableCell> </TableCell>
                <TableCell>
                  <PersonIcon
                    aria-label={
                      atividade === "diarista" ? "contratante" : "diarista"
                    }
                    titleAccess={
                      atividade === "diarista" ? "contratante" : "diarista"
                    }
                  />
                </TableCell>
                <TableCell>
                  <RestoreIcon
                    aria-label={"periodicidade"}
                    titleAccess={"periodicidade"}
                  />
                </TableCell>
                <TableCell>
                  <SvgIcon aria-label={"situação"} titleAccess={"situação"}>
                    <path
                      d={
                        "M17,12c-2.76,0-5,2.24-5,5s2.24,5,5,5c2.76,0,5-2.24,5-5S19.76,12,17,12z M18.65,19.35l-2.15-2.15V14h1v2.79l1.85,1.85 L18.65,19.35z M18,3h-3.18C14.4,1.84,13.3,1,12,1S9.6,1.84,9.18,3H6C4.9,3,4,3.9,4,5v15c0,1.1,0.9,2,2,2h6.11 c-0.59-0.57-1.07-1.25-1.42-2H6V5h2v3h8V5h2v5.08c0.71,0.1,1.38,0.31,2,0.6V5C20,3.9,19.1,3,18,3z M12,5c-0.55,0-1-0.45-1-1 c0-0.55,0.45-1,1-1c0.55,0,1,0.45,1,1C13,4.55,12.55,5,12,5z"
                      }
                    />
                  </SvgIcon>
                </TableCell>
                <TableCell>
                  <CalendarIcon
                    aria-label={"agendamento"}
                    titleAccess={"agendamento"}
                  />
                </TableCell>
                <TableCell>
                  <AlarmIcon aria-label={"horário"} titleAccess={"horário"} />
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {services.map((service, index) => {
                const subject =
                  atividade === "contratante" ? service.diarista : service;
                return (
                  <TableRow key={index}>
                    <TableCell component="th" scope="row" align="center">
                      <Avatar src={subject.foto} />
                    </TableCell>
                    <TableCell>
                      {capitalizeFirstLetter(subject.nome).split(" ")[0]}
                    </TableCell>
                    <TableCell>
                      {getPeriodicity(service.numeroDiariasEm4Semanas)}
                    </TableCell>
                    <TableCell>{getStatus(service.status)}</TableCell>
                    <TableCell>
                      {`${service.diaAgendado} ${moment(
                        service.agendamento
                      ).format("DD/MM")}`}
                    </TableCell>
                    <TableCell>
                      {`${service.horaAgendada}:${service.minAgendado}h`}
                    </TableCell>
                    <TableCell>
                      <IconButton
                        aria-label={"dispensar diária"}
                        color={"secondary"}
                        onClick={() => {}}
                      >
                        <CloseIcon fontSize={"small"} />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Fragment>
  );
};
