/* eslint-disable react/prop-types */
import { Link } from "react-router-dom";
import styles from "./CityItem.module.css";
import { useCities } from "../contexts/CitiesContext";
const formatDate = (date) =>
  new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(date));

function CityItem({ city }) {
  const { cityName, emoji, date, id, country, position } = city;
  const { lat, lng } = position;
  const { currentCity, setCurrentCity, deleteCity } = useCities();
  async function handleClick(e) {
    e.preventDefault();
    await deleteCity(id);
  }
  return (
    <li
      onClick={() => {
        setCurrentCity(id);
      }}
    >
      <Link
        className={`${styles.cityItem} ${
          currentCity == id ? styles["cityItem--active"] : ""
        }`}
        to={`${id}?lat=${lat}&lng=${lng}`}
      >
        <span className={styles.emoji}>
          <img src={`${emoji}`} alt={`Flag of ${country}`} />
        </span>
        <h3 className={styles.name}>{cityName}</h3>
        <time className={styles.date}>{formatDate(date)}</time>
        <button onClick={handleClick} className={styles.deleteBtn}>
          &times;
        </button>
      </Link>
    </li>
  );
}

export default CityItem;
