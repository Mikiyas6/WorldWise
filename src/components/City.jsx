/* eslint-disable  */
import styles from "./City.module.css";

import { useParams, useSearchParams } from "react-router-dom";
import { useCities } from "../contexts/CitiesContext";
const formatDate = (date) =>
  new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "long",
    year: "numeric",
    weekday: "long",
  }).format(new Date(date));

function City() {
  const [searchParams, setSearchParams] = useSearchParams();
  const lat = searchParams.get("lat");
  const lng = searchParams.get("lng");
  const { id } = useParams();
  const { cities } = useCities();
  const currentCity = cities.filter((city) => city.id == id);
  const { cityName, emoji, date, notes } = currentCity[0];
  return (
    <div className={styles.city}>
      <div className={styles.row}>
        <h6>{cityName}</h6>
        <h3>
          <span>
            <img src={emoji} alt="" />
          </span>{" "}
          {cityName}
        </h3>
      </div>

      <div className={styles.row}>
        <h6>You went to {cityName} on</h6>
        <p>{formatDate(date || null)}</p>
      </div>

      {notes && (
        <div className={styles.row}>
          <h6>Your notes</h6>
          <p>{notes}</p>
        </div>
      )}

      <div className={styles.row}>
        <h6>Learn more</h6>
        <a
          href={`https://en.wikipedia.org/wiki/${cityName}`}
          target="_blank"
          rel="noreferrer"
        >
          Check out {cityName} on Wikipedia &rarr;
        </a>
      </div>

      <div></div>
    </div>
  );
}

export default City;
