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
    if (isNaN(timeInSeconds)) {
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

  const renderStatusIcon = () => {
    let icon;
    switch (status) {
      case "Aguardando":
        icon = <FcSurvey style={{ fontSize: "20px" }} />;
        break;
      case "Em produção":
        icon = <FcFlashOn style={{ fontSize: "20px" }} />;
        break;
      case "Rota de Entrega":
        icon = <FcInTransit style={{ fontSize: "23px" }} />;
        break;
      default:
        icon = <FcOk style={{ fontSize: "20px" }} />;
        break;
    }
    return icon;
  };

  const renderTimer = () => {
    return timer.length === 8 || timer.length === 11 ? (
      timer
    ) : (
      <div>Aguardando</div>
    );
  };

  return (
    <tbody className="table_second_row">
      <tr>
        <th>{numeroPedido}</th>
        <th>{cliente}</th>
        <th
          className={status === "Rota de Entrega" ? "status_rota_entrega" : ""}
        >
          {renderStatusIcon()}
          {status}
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
