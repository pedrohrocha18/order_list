import React, { useState } from "react";
import axios from "axios";
import Modal from "../components/modal/Modal";
import OrderItem from "../components/orders/OrderItem";
import "./styles.css";

const Home = () => {
  const [orders, setOrders] = useState([]);

  function convertMinutesToSeconds(minutes) {
    return minutes * 60;
  }

  function convertSecondsToHoursMinutesSeconds(seconds) {
    const hours = Math.floor(seconds / 3600);
    const remainingSeconds = seconds % 3600;
    const minutes = Math.floor(remainingSeconds / 60);
    const finalSeconds = remainingSeconds % 60;

    return {
      hours: hours,
      minutes: minutes,
      seconds: finalSeconds,
    };
  }

  const addOrder = async (order) => {
    const travelTime = await getTravelTime(order.address);

    if (travelTime !== null && travelTime !== undefined) {
      const preparationTime = convertMinutesToSeconds(30);

      const totalTimeInSeconds = travelTime + preparationTime;

      const totalTimeFormatted =
        convertSecondsToHoursMinutesSeconds(totalTimeInSeconds);

      const newOrder = {
        numeroPedido: orders.length + 1,
        cliente: order.name,
        status: "Pendente",
        timer: `${String(totalTimeFormatted.hours).padStart(2, "0")}:${String(
          totalTimeFormatted.minutes
        ).padStart(2, "0")}:${String(totalTimeFormatted.seconds).padStart(
          2,
          "0"
        )}`,
      };

      setOrders([...orders, newOrder]);
    } else {
      console.error("Erro ao calcular o tempo total de entrega.");
    }
  };

  const getTravelTime = async (destination) => {
    const origin = "Rua Valdemar de Sousa Melo, 325, Patos de Minas"; // Defina o endereço de origem aqui

    try {
      const response = await axios.get(
        `http://localhost:5000/api/googlemaps/directions?origin=${encodeURIComponent(
          origin
        )}&destination=${encodeURIComponent(destination)}`
      );

      const route = response.data.routes[0];
      if (!route) {
        throw new Error("Rota não encontrada na resposta da API");
      }

      const durationInSeconds = route.legs[0].duration.value;
      return durationInSeconds;
    } catch (error) {
      console.error("Erro ao buscar tempo de trajeto:", error);
      return null;
    }
  };

  return (
    <main>
      <div className="sub_header">
        <div>
          <h2>Últimos Pedidos</h2>
        </div>
        <div>
          <Modal onAddOrder={addOrder} />
        </div>
      </div>
      <ul className="list_orders">
        <tr className="table_first_row">
          <th>Pedido</th>
          <th>Cliente</th>
          <th>Status</th>
          <th>Tempo</th>
        </tr>
        {orders.map((order) => (
          <OrderItem
            key={order.numeroPedido} // Use uma chave única
            numeroPedido={order.numeroPedido}
            cliente={order.cliente}
            status={order.status}
            timer={order.timer}
          />
        ))}
      </ul>
    </main>
  );
};

export default Home;
