import { useState, useEffect } from "react";
import axios from "axios";

const useGoogleMaps = (origin, destination) => {
  const [duration, setDuration] = useState(null);

  useEffect(() => {
    if (!origin || !destination) return;

    const fetchRoute = async () => {
      try {
        const response = await axios.get(
          `https://maps.googleapis.com/maps/api/directions/json`,
          {
            params: {
              origin: origin,
              destination: destination,
              key: AIzaSyDlhN9fEe6HguMYPIDpBmfDGNTEFPAC2yI,
            },
          }
        );
        const route = response.data.routes[0];
        const duration = route.legs[0].duration.value; // duração em segundos
        setDuration(duration);
      } catch (error) {
        console.error("Erro ao buscar a rota:", error);
      }
    };

    fetchRoute();
  }, [origin, destination]);

  return duration;
};

export default useGoogleMaps;
