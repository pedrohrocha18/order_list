import React, { useEffect, useState } from "react";
import "./orderitem.css";
import {
  FcSurvey,
  FcClock,
  FcFlashOn,
  FcInTransit,
  FcOk,
} from "react-icons/fc";

const OrderItem = ({ numeroPedido, cliente, status, timeLeft }) => {
  const formatTime = (timeInSeconds) => {
    if (isNaN(timeInSeconds) || timeInSeconds <= 0) {
      return "00:00:00";
    }
    const hours = Math.floor(timeInSeconds / 3600);
    const minutes = Math.floor((timeInSeconds % 3600) / 60);
    const seconds = timeInSeconds % 60;
    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
      2,
      "0"
    )}:${String(seconds).padStart(2, "0")}`;
  };

  const [timer, setTimer] = useState(formatTime(timeLeft));

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer(formatTime(timeLeft));
    }, 1000);
    return () => clearInterval(interval);
  }, [timeLeft]);

  // Função para renderizar o timer ou a mensagem "Aguardando"
  const renderTimer = () => {
    return timer === "00:00:00" ? "Aguardando" : timer;
  };

  // Função para renderizar o ícone e o status de acordo com o status do pedido
  const renderStatusIcon = () => {
    switch (status) {
      case "Aguardando":
        return <FcSurvey style={{ fontSize: "20px" }} />;
      case "Em produção":
        return <FcFlashOn style={{ fontSize: "20px" }} />;
      case "Rota de Entrega":
        return <FcInTransit style={{ fontSize: "20px" }} />;
      case "Entregue":
        return <FcOk style={{ fontSize: "20px" }} />;
      default:
        return null;
    }
  };

  // Função para adicionar classes adicionais ao status de acordo com o estado
  const getStatusClass = () => {
    if (status === "Rota de Entrega") {
      return "status_rota_entrega";
    }
    return "";
  };

  return (
    <tbody className="table_second_row">
      <tr>
        <th>{numeroPedido}</th>
        <th>{cliente}</th>
        <th className={getStatusClass()}>
          {renderStatusIcon()} {status}
        </th>
        <th>
          <FcClock style={{ fontSize: "20px" }} />
          {renderTimer()}
        </th>
      </tr>
    </tbody>
  );
};

export default OrderItem;
