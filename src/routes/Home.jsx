import React, { useState } from "react";
import "./styles.css";
import Modal from "../components/modal/Modal";
import OrderItem from "../components/orders/OrderItem";

const Home = () => {
  const [orders, setOrders] = useState([]);

  const addOrder = (order) => {
    const newOrder = {
      numeroPedido: orders.length + 1,
      cliente: order.name,
      status: "Pendente", // Aqui você pode definir um status padrão ou deixar dinâmico
      timer: "00:00", // Aqui você pode definir um timer padrão ou deixar dinâmico
    };
    setOrders([...orders, newOrder]);
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
