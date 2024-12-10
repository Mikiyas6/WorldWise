import { createContext, useContext, useEffect, useState } from "react";
/*eslint-disable */
const CitiesContext = createContext();
const URL = "http://localhost:8000";
const BIG_URL = "https://restcountries.com/v3.1/name/";
function CitiesProvider({ children }) {
  // All the state and state updating code
  const [cities, setCities] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentCity, setCurrentCity] = useState(null);
  // ########################################
  async function getFlag(data) {
    try {
      const res = await fetch(`${BIG_URL}${data.country}`);
      const newData = await res.json();
      return newData[0].flags.png;
    } catch (err) {
      throw new Error(`${err.message} (Error getting flag of the country)`);
    }
  }
  useEffect(function () {
    async function fetchCities() {
      try {
        setIsLoading(true);
        const res = await fetch(`${URL}/cities`);
        const data = await res.json();
        const newData = await Promise.all(
          data.map(async function (eachData) {
            const flag = await getFlag(eachData);
            return { ...eachData, emoji: flag };
          })
        );
        setCities(newData);
      } catch (err) {
        throw new Error(err.message);
      } finally {
        setIsLoading(false);
      }
    }

    fetchCities();
  }, []);
  // ########################################
  const value = {
    cities,
    isLoading,
    setIsLoading,
    getFlag,
    currentCity,
    setCurrentCity,
  };
  // ########################################
  return (
    <CitiesContext.Provider value={value}>{children}</CitiesContext.Provider>
  );
}
// ########################################
function useCities() {
  const context = useContext(CitiesContext);
  if (context === undefined)
    throw new Error("Cities Context was used outside the CitiesProvider");
  return context;
}
export { CitiesProvider, useCities };
