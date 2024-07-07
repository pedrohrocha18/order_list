import React, { useState } from "react";
import axios from "axios";
import Modal from "../components/modal/Modal";
import OrderItem from "../components/orders/OrderItem";
import "./styles.css";

const Home = () => {
  const [orders, setOrders] = useState([]);

  const addOrder = async (order) => {
    const newOrder = {
      numeroPedido: orders.length + 1,
      cliente: order.name,
      status: "Pendente",
      timer: await getTravelTime(order.address),
    };
    setOrders([...orders, newOrder]);
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

      const duration = route.legs[0].duration.text;
      return duration;
    } catch (error) {
      console.error("Erro ao buscar tempo de trajeto:", error);
      return "Erro ao buscar tempo de trajeto";
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
