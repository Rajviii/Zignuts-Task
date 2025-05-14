import styles from "../../assets/styles/GoBackButton.module.css";
import { useNavigate } from "react-router-dom";

export default function GoBackButton() {
  const navigate = useNavigate();
  return (
    <button onClick={() => navigate(-1)} className={styles.backBtn}>
      ← Go Back
    </button>
  );
}
