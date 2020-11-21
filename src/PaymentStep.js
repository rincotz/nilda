import FormIntro from "./components/FormIntro";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import PaymentIcon from "@material-ui/icons/AttachMoney";

export default () => (
  <Box
    display={"flex"}
    flexDirection={"column"}
    justifyContent={"center"}
    alignItems={"center"}
    height={11 / 12}
  >
    <FormIntro
      icon={<PaymentIcon style={{ fontSize: 50 }} />}
      title={"Pagamento"}
      text={`Após o pagamento do boleto, sua contratação estará concluída. Em até 5 dias você receberá o agendamento com os dados da diarista que irá cuidar de sua casa.`}
    />
    <Box my={2}>
      <Button variant={"contained"} color={"secondary"}>
        Imprimir boleto
      </Button>
    </Box>
  </Box>
);
