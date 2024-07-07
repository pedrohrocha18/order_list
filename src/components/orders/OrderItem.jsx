import React from "react";
import "./orderitem.css";

const OrderItem = ({ numeroPedido, cliente, status, timer }) => {
  return (
    <>
      <tr className="table_second_row">
        <td>{numeroPedido}</td>
        <td>{cliente}</td>
        <td>{status}</td>
        <td>{timer}</td>
      </tr>
    </>
  );
};

export default OrderItem;
