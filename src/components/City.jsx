/* eslint-disable  */
import { CityProvider } from "../contexts/CityContext";
import SelectedCity from "./SelectedCity";
function City() {
  return (
    <CityProvider>
      <SelectedCity />
    </CityProvider>
  );
}

export default City;
