import { Link } from "react-router-dom";
import styles from "./Logo.module.css";

function Logo() {
  return (
    <Link to="/">
      <img
        src={process.env.PUBLIC_URL + "/logo.png"}
        alt="WorldWise logo"
        className={styles.logo}
      />{" "}
    </Link>
  );
}
export default Logo;
