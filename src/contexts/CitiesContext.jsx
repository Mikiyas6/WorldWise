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
  // When you use useCallback, React recreates the function whenever any of the dependencies in the array change because the dependencies define the function's closure. The closure is the environment in which the function is defined, including all variables it references outside its scope.
  //Memoization is not meant to prevent re-execution of functions with the same arguments. If you want to avoid executing the same function call repeatedly with the same arguments, you need to implement caching logic inside the function. Memoizing based on arguments is unnecessary because the React dependency array tracks values that impact function creation, not execution.
  // ####################################################
  //   const [count, setCount] = useState(0);

  // const displayCurrentCount = useCallback(() => {
  //   console.log(count); // Depends on the closure of `count`
  // }, [count]);
  // Imagine that we passed this function as a prop to a certain component. and inside that component, whenever we want to know the current count value, we call it.
  // Here, the displayCurrentCount function "remembers" the value of count in its closure when it is created. If count changes but the function is not recreated, the function would use the old count value, which is incorrect. React ensures that the closure is up-to-date by recreating the function whenever its dependencies change.
  // In short, If we don't recreate a function that uses state(i.e cities) in its definition by putting those states in the dependency array of the useCallback that we use to memoize the function, then if the state(cities) changes and if we call the function with a certain value (id), then it's gonna use the old cities value. But if we use cities as a dependency value, then, when cities is updated, then the function is going to be recreated, which will update the cities that we used inside of the function and we will get the desired value.

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
