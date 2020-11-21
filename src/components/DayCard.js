import React, { useEffect, useState } from "react";
import WorkerCard from "./WorkerCard";
import Box from "@material-ui/core/Box";
import IconButton from "@material-ui/core/IconButton";
import CheckIcon from "@material-ui/icons/CheckCircle";
import CalendarIcon from "@material-ui/icons/Event";
import { CircularProgress } from "@material-ui/core";

export default (props) => {
  const [workers, setWorkers] = useState("");
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchData = async () => {
      const result = await props.getWorkers(props.diaAgendado);
      setWorkers(result);
    };
    fetchData().then(() => setLoading(false));
  }, []);
  return (
    <Box
      boxShadow={3}
      width={4 / 5}
      mx={"auto"}
      my={2}
      p={2}
      display={"flex"}
      flexDirection={"column"}
    >
      <Box fontSize={"h5.fontSize"} mb={2}>
        <CalendarIcon style={{ verticalAlign: "middle" }} /> {props.diaAgendado}
        , {props.hora}:{props.min}
      </Box>
      <Box mx={"auto"}>
        {loading ? (
          <CircularProgress color={"primary"} />
        ) : workers.length > 0 ? (
          workers.map((worker, index) => (
            <Box my={1} key={index}>
              <WorkerCard worker={worker} distance={worker.distance} />
            </Box>
          ))
        ) : (
          "em até 3 dias você receberá os dados da diarista que irá cuidar de sua casa ou seu dinheiro de volta"
        )}
      </Box>
      {!loading && workers.length === 0 && (
        <Box display={"flex"} justifyContent={"flex-end"}>
          <IconButton color={"primary"}>
            <CheckIcon />
          </IconButton>
        </Box>
      )}
    </Box>
  );
};
