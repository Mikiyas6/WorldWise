/*eslint-disable*/
import { createContext, useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useCities } from "./CitiesContext";
import Spinner from "../components/Spinner";
import Message from "../components/Message";
const URL = "http://localhost:8000/cities";
const CityContext = createContext();
function CityProvider({ children }) {
  const { id } = useParams();
  const [city, setCity] = useState(null);
  const { isLoading, setIsLoading, getFlag } = useCities();
  useEffect(
    function () {
      async function fetchCity() {
        try {
          setIsLoading(true);
          const res = await fetch(`${URL}/${id}`);
          const data = await res.json();
          const flag = await getFlag(data);
          const city = { ...data, emoji: flag };
          setCity(city);
        } catch (err) {
          console.error(err);
        } finally {
          setIsLoading(false);
        }
      }
      fetchCity();
    },
    [id]
  );
  const value = { city };
  if (isLoading) return <Spinner />;
  if (!city) return <Message message="No City Found" />;
  return <CityContext.Provider value={value}>{children}</CityContext.Provider>;
}
function useCity() {
  const context = useContext(CityContext);
  if (context === undefined)
    throw new Error("Context is used outside of  CityProvider");
  return context;
}
export { CityProvider, useCity };
