import React from "react";
import "./styles.css";
import OrderItem from "../components/orders/OrderItem";
import Modal from "../components/modal/Modal";

const Home = () => {
  return (
    <main>
      <div className="sub_header">
        <div>
          <h2>Últimos Pedidos</h2>
        </div>
        <div>
          <Modal />
        </div>
      </div>
      <ul className="list_orders">
        <OrderItem />
      </ul>
    </main>
  );
};

export default Home;
