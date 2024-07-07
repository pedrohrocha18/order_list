import React from "react";
import "./styles.css";
import OrderItem from "../components/orders/OrderItem";

const Home = () => {
  return (
    <main>
      <div className="sub_header">
        <h2>Últimos Pedidos</h2>
        <button className="button_add_order">+ Adicionar Pedido</button>
      </div>
      <ul className="list_orders">
        <OrderItem />
      </ul>
    </main>
  );
};

export default Home;
