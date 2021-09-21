import React from "react";
import Box from "@material-ui/core/Box";
import CalendarIcon from "@material-ui/icons/Event";
import CartaoContratante from "./CartaoContratante";

export default (props) =>
  props.servicos.length > 0 && (
    <Box
      boxShadow={2}
      borderRadius={16}
      m={"1rem"}
      p={"0.5rem"}
      maxWidth={"22rem"}
      display={"flex"}
      flexDirection={"column"}
    >
      <Box fontSize={"h5.fontSize"} mb={2}>
        <CalendarIcon style={{ verticalAlign: "middle" }} /> {props.dia}
      </Box>
      <Box mx={"auto"}>
        {props.servicos.map((servico) => (
          <Box my={1} key={servico.sid}>
            <CartaoContratante service={servico} {...props} />
          </Box>
        ))}
      </Box>
    </Box>
  );
