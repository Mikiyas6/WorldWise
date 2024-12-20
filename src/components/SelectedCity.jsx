import styles from "./City.module.css";
import { useCity } from "../contexts/CityContext";
import ButtonBack from "./ButtonBack";
const formatDate = (date) =>
  new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "long",
    year: "numeric",
    weekday: "long",
  }).format(new Date(date));
function SelectedCity() {
  const { city } = useCity();
  const { cityName, emoji, date, notes } = city;
  return (
    <div className={styles.city}>
      <div className={styles.row}>
        <h6>{cityName}</h6>
        <h3>
          <span>
            <img src={emoji} alt="" />
          </span>
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

      <div>
        <ButtonBack />
      </div>
    </div>
  );
}
export default SelectedCity;
