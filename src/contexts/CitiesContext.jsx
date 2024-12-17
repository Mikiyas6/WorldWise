/*eslint-disable */
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useReducer,
} from "react";
import { useBig } from "./BigContext";
// const URL = "http://localhost:8000";
const BIG_URL = "https://restcountries.com/v3.1/name/";
const CitiesContext = createContext();

function reducer(state, action) {
  switch (action.type) {
    case "loading":
      return { ...state, isLoading: true };
    case "cities/loaded":
      return { ...state, isLoading: false, cities: action.payload };
    case "city/loaded":
      return { ...state, isLoading: false, currentCity: action.payload };
    case "city/created":
      return {
        ...state,
        isLoading: false,
        cities: [...state.cities, action.payload],
        currentCity: action.payload,
      };
    case "city/deleted":
      return {
        ...state,
        isLoading: false,
        cities: state.cities.filter((city) => city.id !== action.payload),
        currentCity: {},
      };
    case "rejected":
      return { ...state, isLoading: false, error: action.payload };
    default:
      throw new Error("Action Type Unknown");
  }
}

const initialState = {
  cities: [],
  isLoading: false,
  currentCity: {},
  error: "",
};

function CitiesProvider({ children }) {
  // All the state and state updating code
  const { user } = useBig();
  const [state, dispatch] = useReducer(reducer, initialState);
  const { cities, isLoading, currentCity } = state;
  // ########################################
  async function getFlag(data) {
    try {
      const res = await fetch(`${BIG_URL}${data.country}`);
      const newData = await res.json();
      return newData[0].flags.svg;
    } catch (err) {
      throw new Error(`${err.message} (Error getting flag of the country)`);
    }
  }
  useEffect(
    function () {
      async function fetchCities() {
        dispatch({ type: "loading" });
        try {
          // const res = await fetch(`${URL}/cities`);
          // const data = await res.json();
          // const newData = await Promise.all(
          //   data.map(async function (eachData) {
          //     const flag = await getFlag(eachData);
          //     return { ...eachData, emoji: flag };
          //   })
          // );

          // dispatch({ type: "cities/loaded", payload: newData });

          dispatch({ type: "cities/loaded", payload: user.cities });
        } catch (err) {
          dispatch({ type: "rejected", payload: err.message });
        }
      }
      fetchCities();
    },
    [user]
  );
  async function createCity(newCity) {
    dispatch({ type: "loading" });
    try {
      // const res = await fetch(`${URL}/cities`, {
      //   method: "POST",
      //   body: JSON.stringify(newCity),
      //   headers: { "Content-Type": "application/json" },
      // });
      // const data = await res.json();
      dispatch({ type: "city/created", payload: newCity });
    } catch (err) {
      throw new Error(err.message);
    }
  }
  const getCity = useCallback(
    async function getCity(id) {
      if (Number(id) === currentCity.id) return;
      dispatch({ type: "loading" });
      try {
        // const res = await fetch(`${URL}/cities/${id}`);
        const data = cities.filter((city) => city.id === id)[0];
        dispatch({ type: "city/loaded", payload: data });
      } catch (err) {
        dispatch({ type: "rejected", payload: err.message });
      }
    },
    [cities, currentCity.id]
  );
  async function deleteCity(id) {
    dispatch({ type: "loading" });
    try {
      // await fetch(`${URL}/cities/${id}`, {
      //   method: "DELETE",
      // });
      dispatch({ type: "city/deleted", payload: id });
    } catch (err) {
      dispatch({ type: "rejected", payload: err.message });
    }
  }
  // ########################################
  const value = {
    cities,
    isLoading,
    getFlag,
    currentCity,
    createCity,
    deleteCity,
    getCity,
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
