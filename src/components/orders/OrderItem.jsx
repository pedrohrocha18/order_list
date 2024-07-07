import React from "react";
import "./orderitem.css";

const OrderItem = ({ numeroPedido, cliente, timer }) => {
  return (
    <>
      <table className="table">
        <tr className="table_first_row">
          <th>Pedido</th>
          <th>Cliente</th>
          <th>Status</th>
          <th>Tempo</th>
        </tr>
        <tr className="table_second_row">
          <td>{numeroPedido}</td>
          <td>{cliente}</td>
          <td>Em rota de entrega</td>
          <td>{timer}</td>
        </tr>
      </table>
    </>
  );
};

export default OrderItem;
