import styles from "../../assets/styles/Loader.module.css";

export default function Loader() {
  return (
    <div className={styles.spinnerWrapper}>
      <div className={styles.loader}></div>
    </div>
  );
}
