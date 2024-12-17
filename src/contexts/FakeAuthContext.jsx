/*eslint-disable */
import { useContext, createContext, useReducer } from "react";
import { useBig } from "./BigContext";

const AuthContext = createContext();
const initialState = {
  user: null,
  isAuthenticated: false,
};
function reducer(state, action) {
  switch (action.type) {
    case "login":
      return { ...state, user: action.payload, isAuthenticated: true };
    case "logout":
      return { ...state, user: null, isAuthenticated: false };
    default:
      throw new Error("Unknown action");
  }
}
const FAKE_USER = [
  {
    name: "Lily❤",
    email: "lily.yishak2@gmail.com",
    password: "1111",
    avatar: "lily",
    cities: [
      {
        cityName: "Arat Kilo",
        country: "Ethiopia",
        emoji: "https://flagcdn.com/et.svg",
        date: "2024-11-12T15:59:59.138Z",
        notes:
          "I've been sick and tired of coming here everyday for the past 4 years. When is it gonna end😭😭😭😭",
        position: {
          lat: 9.030052740610376,
          lng: 38.762044677932224,
        },
        id: "739303856",
      },
      {
        cityName: "Haya Hulet",
        country: "Ethiopia",
        emoji: "https://flagcdn.com/et.svg",
        date: "2024-11-12T15:59:59.138Z",
        notes:
          "If only my old man could drive...I would've never step foot in here. ",
        position: {
          lat: 9.030052740610376,
          lng: 38.762044677932224,
        },
        id: "739303855656",
      },
      {
        cityName: "Bole Bulbula",
        country: "Ethiopia",
        emoji: "https://flagcdn.com/et.svg",
        date: "2024-11-12T15:59:59.138Z",
        notes: "The best place on earth😊. I would've lived here if i could.",
        position: {
          lat: 8.984595371879692,
          lng: 38.77043292210462,
        },
        id: "739303855656666",
      },
    ],
  },
  {
    name: "Mike",
    email: "Mikiyas.Tewodroes@a2sv.org",
    password: "2222",
    avatar: "mike",
    cities: [
      {
        cityName: "Yeka Abado",
        country: "Ethiopia",
        emoji: "https://flagcdn.com/et.svg",
        date: "2024-12-17T15:59:59.138Z",
        notes: "This is the actual best place on earth. Not Bole sth",
        position: {
          lat: 9.070624906458066,
          lng: 38.875843153898394,
        },
        id: "7393038556563434",
      },
    ],
  },
];
function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { user, isAuthenticated } = state;
  const { setUser } = useBig();
  function login(email, password) {
    FAKE_USER.forEach((user) => {
      if (email === user.email && password === user.password) {
        dispatch({ type: "login", payload: { ...user } });
        setUser(user);
      }
    });
  }
  function logout() {
    dispatch({ type: "logout" });
  }
  const value = { user, isAuthenticated, login, logout };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined)
    throw new Error("AuthContext was used outside of AuthProvider");
  return context;
}
export { AuthProvider, useAuth };
