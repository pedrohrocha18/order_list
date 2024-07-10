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

  // Verificação do comprimento do timer
  const renderTimer = () => {
    if (timer.length === 8 || timer.length === 11) {
      return timer;
    } else {
      return <div>Aguardando</div>;
    }
  };

  return (
      <tbody className="table_second_row">
        <tr>
          <th>{numeroPedido}</th>
          <th>{cliente}</th>
          {status === "Aguardando" ? (
            <th>
              <FcSurvey style={{ fontSize: "20px" }} />
              {status}
            </th>
          ) : status === "Em produção" ? (
            <th>
              <FcFlashOn style={{ fontSize: "20px" }} />
              {status}
            </th>
          ) : status === "Rota de Entrega" ? (
            <th className="status_rota_entrega">
              <FcInTransit style={{ fontSize: "23px" }} />
              {status}
            </th>
          ) : (
            <th style={{ gap: "5px", width: "95px" }}>
              <FcOk style={{ fontSize: "20px" }} />
              {status}
            </th>
          )}
          <th>
            <FcClock style={{ fontSize: "20px" }} />
            {renderTimer()}
          </th>
        </tr>
      </tbody>
  );
};

export default OrderItem;
