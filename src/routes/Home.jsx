import React, { useState, useEffect } from "react";
import axios from "axios";
import Modal from "../components/modal/Modal";
import OrderItem from "../components/orders/OrderItem";
import "./styles.css";

const Home = () => {
  const [orders, setOrders] = useState([]);
  const [timeLeft, setTimeLeft] = useState({});
  const [ordersInProduction, setOrdersInProduction] = useState([]);

  // Função para converter minutos em segundos
  function convertMinutesToSeconds(minutes) {
    return minutes * 60;
  }

  // Função para converter segundos em horas, minutos e segundos
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

  // Função para adicionar um novo pedido
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
        status: ordersInProduction.length < 3 ? "Em produção" : "Aguardando",
        totalTimeInSeconds: totalTimeInSeconds,
        totalTimeFormatted: totalTimeFormatted,
      };

      setOrders([...orders, newOrder]);

      // Se tiver menos de 3 pedidos em produção, iniciar o cronômetro
      if (ordersInProduction.length < 3) {
        startTimer(newOrder);
      }
    } else {
      console.error("Erro ao calcular o tempo total de entrega.");
    }
  };

  // Função para obter o tempo de trajeto
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

  // Função para iniciar o cronômetro para um pedido específico
  const startTimer = (order) => {
    // Definir o tempo restante inicialmente
    const { totalTimeInSeconds } = order;
    setTimeLeft((prevTimeLeft) => ({
      ...prevTimeLeft,
      [order.numeroPedido]: totalTimeInSeconds,
    }));

    // Iniciar o intervalo para decrementar o tempo restante
    const interval = setInterval(() => {
      setTimeLeft((prevTimeLeft) => {
        const newTimeLeft = {
          ...prevTimeLeft,
          [order.numeroPedido]: prevTimeLeft[order.numeroPedido] - 1,
        };

        const elapsedTime =
          totalTimeInSeconds - newTimeLeft[order.numeroPedido];

        if (elapsedTime >= 1800 && order.status === "Em produção") {
          // Atualizar o status do pedido para "Rota de Entrega" após 30 minutos
          setOrders((prevOrders) =>
            prevOrders.map((o) =>
              o.numeroPedido === order.numeroPedido
                ? { ...o, status: "Rota de Entrega" }
                : o
            )
          );

          // Remover da lista de produção e adicionar à lista de entrega
          setOrdersInProduction((prev) =>
            prev.filter((o) => o.numeroPedido !== order.numeroPedido)
          );
        }

        if (newTimeLeft[order.numeroPedido] <= 0) {
          // Atualizar o status do pedido para "Entregue" quando o cronômetro chegar a zero
          setOrders((prevOrders) =>
            prevOrders.map((o) =>
              o.numeroPedido === order.numeroPedido
                ? { ...o, status: "Entregue" }
                : o
            )
          );

          // Remover da lista de produção
          setOrdersInProduction((prev) =>
            prev.filter((o) => o.numeroPedido !== order.numeroPedido)
          );
          clearInterval(interval);
        }
        return newTimeLeft;
      });
    }, 1000);

    // Adicionar o ID do intervalo ao estado do pedido
    setOrders((prevOrders) =>
      prevOrders.map((o) =>
        o.numeroPedido === order.numeroPedido
          ? { ...o, intervalId: interval }
          : o
      )
    );

    // Adicionar à lista de produção se houver menos de 3 pedidos em produção
    if (ordersInProduction.length < 3) {
      setOrdersInProduction((prev) => [...prev, order]);
    }
  };

  useEffect(() => {
    // Ao iniciar, buscar os primeiros 3 pedidos em produção
    const initialOrders = orders
      .filter((order) => order.status === "Em produção")
      .slice(0, 3);
    initialOrders.forEach((order) => startTimer(order));

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    // Verificar se há pedidos em "Aguardando" para movê-los para "Em produção"
    const waitingOrders = orders.filter(
      (order) => order.status === "Aguardando"
    );
    const toMove = Math.min(
      3 - ordersInProduction.length,
      waitingOrders.length
    );

    if (toMove > 0) {
      const newOrdersInProduction = waitingOrders
        .slice(0, toMove)
        .map((order) => ({
          ...order,
          status: "Em produção",
        }));

      setOrders((prevOrders) =>
        prevOrders.map((o) =>
          newOrdersInProduction.some(
            (newOrder) => newOrder.numeroPedido === o.numeroPedido
          )
            ? { ...o, status: "Em produção" }
            : o
        )
      );

      newOrdersInProduction.forEach((order) => startTimer(order));
    }
  }, [orders, ordersInProduction]);

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
      <table className="table">
        <tr className="table_first_row">
          <th>Pedido</th>
          <th>Cliente</th>
          <th>Status</th>
          <th>Tempo</th>
        </tr>
        {orders.map((order) => (
          <OrderItem
            key={order.numeroPedido}
            numeroPedido={order.numeroPedido}
            cliente={order.cliente}
            status={order.status}
            totalTime={`${String(order.totalTimeFormatted.hours).padStart(
              2,
              "0"
            )}:${String(order.totalTimeFormatted.minutes).padStart(
              2,
              "0"
            )}:${String(order.totalTimeFormatted.seconds).padStart(2, "0")}`}
            timeLeft={timeLeft[order.numeroPedido]}
          />
        ))}
      </table>
    </main>
  );
};

export default Home;
