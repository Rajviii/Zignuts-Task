import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import styles from "../../assets/styles/PasswordInput.module.css";

export default function PasswordInput({ register, name, placeholder, error }) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className={styles.wrapper}>
      <input
        type={showPassword ? "text" : "password"}
        placeholder={placeholder}
        {...register(name)}
        className={`${styles.input} ${error ? styles.inputError : ""}`}
      />
      <span
        className={styles.eyeIcon}
        onClick={() => setShowPassword(!showPassword)}
      >
        {showPassword ? <FaEye /> : <FaEyeSlash />}
      </span>
      {error && <p className={styles.error}>{error.message}</p>}
    </div>
  );
}