import React, { useState, useEffect } from "react";
import axios from "axios";
import Modal from "../components/modal/Modal";
import OrderItem from "../components/orders/OrderItem";
import "./styles.css";

const Home = () => {
  const [orders, setOrders] = useState([]);
  const [timeLeft, setTimeLeft] = useState({});
  const [ordersInProduction, setOrdersInProduction] = useState([]);

  // Função para converter Minutos em Segundos
  function convertMinutesToSeconds(minutes) {
    return minutes * 60;
  }

  // Função para converter Segundos em Horas/Minutos/Segundos
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

    if (travelTime != null) {
      const preparationTimeSeconds = convertMinutesToSeconds(30);
      const totalTimeInSeconds = travelTime + preparationTimeSeconds;

      const totalTimeFormatted =
        convertSecondsToHoursMinutesSeconds(totalTimeInSeconds);

      const newOrder = {
        numeroPedido: orders.length + 1,
        cliente: order.name,
        status: ordersInProduction.length < 5 ? "Em produção" : "Aguardando",
        totalTimeInSeconds,
        totalTimeFormatted,
      };

      setOrders([...orders, newOrder]);

      if (ordersInProduction.length < 5) {
        startTimer(newOrder);
      } else {
        startWaitingTimer(newOrder);
      }
    } else {
      console.error("Erro ao calcular o tempo total de entrega.");
    }
  };

  // Função para obter o tempo de trajeto
  const getTravelTime = async (destination) => {
    const origin = "Rua Valdemar de Sousa Melo, 325, Patos de Minas"; // Endereço de origem fixo

    try {
      const url = `http://localhost:5000/api/googlemaps/directions`;
      const params = {
        origin: origin,
        destination: destination,
      };

      const response = await axios.get(url, { params });

      const route = response.data.routes[0];
      if (!route) {
        throw new Error("Rota não encontrada na resposta da API");
      }

      const durationInSeconds = route.legs[0].duration.value;
      return durationInSeconds;
    } catch (error) {
      console.error("Erro ao buscar tempo de trajeto:", error.message);
      return null;
    }
  };

  // Função para iniciar o cronômetro para um pedido específico
  const startTimer = (order) => {
    const { totalTimeInSeconds } = order;
    setTimeLeft((prevTimeLeft) => ({
      ...prevTimeLeft,
      [order.numeroPedido]: totalTimeInSeconds,
    }));

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

          // Remover da lista de produção e da lista de entrega
          setOrdersInProduction((prev) =>
            prev.filter((o) => o.numeroPedido !== order.numeroPedido)
          );

          // Limpar o intervalo
          clearInterval(interval);
          return newTimeLeft;
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

    // Adicionar à lista de produção se houver menos de 5 pedidos em produção
    if (ordersInProduction.length < 5) {
      setOrdersInProduction((prev) => [...prev, order]);
    }
  };

  // Função para iniciar o cronômetro de espera para um pedido específico
  const startWaitingTimer = (order) => {
    const waitingInterval = setTimeout(() => {
      // Atualizar o estado do pedido para "Em produção"
      setOrders((prevOrders) =>
        prevOrders.map((o) =>
          o.numeroPedido === order.numeroPedido
            ? { ...o, status: "Em produção" }
            : o
        )
      );

      // Limpar o intervalo de espera
      clearTimeout(waitingInterval);

      // Iniciar o cronômetro de produção após mover para "Em produção"
      const updatedOrder = { ...order, status: "Em produção" };
      startTimer(updatedOrder);
    }, convertMinutesToSeconds(10) * 1000);

    // Adicionar o ID do intervalo de espera ao estado do pedido
    setOrders((prevOrders) =>
      prevOrders.map((o) =>
        o.numeroPedido === order.numeroPedido
          ? { ...o, waitingIntervalId: waitingInterval }
          : o
      )
    );
  };

  useEffect(() => {
    // Ao iniciar, buscar os primeiros 5 pedidos em produção
    const initialOrders = orders
      .filter((order) => order.status === "Em produção")
      .slice(0, 5);
    initialOrders.forEach((order) => startTimer(order));
  }, []);

  useEffect(() => {
    // Filtrar pedidos em "Aguardando"
    const waitingOrders = orders.filter(
      (order) => order.status === "Aguardando"
    );

    // Determinar quantos pedidos podem ser movidos para "Em produção"
    const maxOrdersToMove = 5 - ordersInProduction.length;
    const ordersToMoveCount = Math.min(maxOrdersToMove, waitingOrders.length);

    if (ordersToMoveCount > 0) {
      // Selecionar os pedidos que serão movidos
      const ordersToMove = waitingOrders.slice(0, ordersToMoveCount);

      // Atualizar o estado dos pedidos para "Em produção"
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          ordersToMove.some(
            (newOrder) => newOrder.numeroPedido === order.numeroPedido
          )
            ? { ...order, status: "Em produção" }
            : order
        )
      );

      // Iniciar o timer para cada novo pedido em produção
      ordersToMove.forEach((order) => startTimer(order));
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
        <tbody className="table_first_row">
          <tr>
            <th>Pedido</th>
            <th>Cliente</th>
            <th>Status</th>
            <th>Tempo</th>
          </tr>
        </tbody>
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
