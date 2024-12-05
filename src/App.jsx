import { useEffect, useState } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Product from "./pages/Product";
import Pricing from "./pages/Pricing";
import Homepage from "./pages/Homepage";
import PageNotFound from "./pages/PageNotFound";
import AppLayout from "./pages/AppLayout";
import Login from "./pages/Login";
import CityList from "./components/CityList";
import CountryList from "./components/CountryList";
import City from "./components/City";
import Form from "./components/Form";
const URL = "http://localhost:8000";
const BIG_URL = "https://restcountries.com/v3.1/name/";
function App() {
  const [cities, setCities] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  async function getFlag(data) {
    const res = await fetch(`${BIG_URL}${data.country}`);
    const newData = await res.json();
    return newData[0].flags.png;
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
            console.log(flag);
            return { ...eachData, emoji: flag };
          })
        );
        setCities(newData);
      } catch (err) {
        alert(err.message);
      } finally {
        setIsLoading(false);
      }
    }

    fetchCities();
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<Homepage />} />
        <Route path="pricing" element={<Pricing />} />
        <Route path="product" element={<Product />} />
        <Route path="login" element={<Login />} />
        {/* When you define nested routes in your Routes configuration, <Outlet> is the mechanism that renders those child components inside the parent route's component.
        Without <Outlet>, the parent route cannot display the content of its nested routes. */}

        {/* If there are nested routes, The parent Route Usually Displays A layout. Inside of that Layout, There should be a place where we specify Outlet such that The children Routes can display their corresponding React component there. Only one child route is displayed at a time, so it works fine. */}
        <Route path="app" element={<AppLayout />}>
          {/* As soon as the index route is hit, we're going to be redirected to cities route  */}
          <Route index element={<Navigate replace to="cities" />} />
          <Route
            path="cities"
            element={<CityList cities={cities} isLoading={isLoading} />}
          />
          <Route path="cities/:id" element={<City cities={cities} />} />
          <Route
            path="countries"
            element={<CountryList cities={cities} isLoading={isLoading} />}
          />
          <Route path="form" element={<Form />} />
        </Route>
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
