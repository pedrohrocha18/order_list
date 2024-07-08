import React, { useEffect, useState } from "react";
import "./orderitem.css";
import { FcClock } from "react-icons/fc";

const OrderItem = ({ numeroPedido, cliente, status, timeLeft }) => {
  const formatTime = (timeInSeconds) => {
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

  return (
    <tr className="table_second_row">
      <th>{numeroPedido}</th>
      <th>{cliente}</th>
      <th>{status}</th>
      <th>
        <div>
          <FcClock style={{ fontSize: "20px" }} />
        </div>
        {timer}
      </th>
    </tr>
  );
};

export default OrderItem;
