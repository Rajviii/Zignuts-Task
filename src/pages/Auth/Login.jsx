import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import styles from "../../assets/styles/Login.module.css";
import CryptoJS from "crypto-js";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import Swal from "sweetalert2";
import PasswordInput from "../../components/common/PasswordInput";

const schema = yup.object().shape({
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup.string().required("Password is required"),
});

export default function Login() {
  const navigate = useNavigate();
  const [loginError, setLoginError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = (data) => {
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const foundUser = users.find((user) => user.email === data.email);

    if (!foundUser) {
      setLoginError("Email not found");
      return;
    }

    const decryptedPassword = CryptoJS.AES.decrypt(
      foundUser.password,
      "secret-key"
    ).toString(CryptoJS.enc.Utf8);

    if (decryptedPassword !== data.password) {
      setLoginError("Incorrect password");
      return;
    }

    localStorage.setItem("loggedInUser", JSON.stringify(foundUser));
    Swal.fire({
      title: "Login",
      text: "Login successful",
      icon: "success",
      confirmButtonText: "OK",
      timer: 3000,
      timerProgressBar: true,
    });
    navigate("/products");
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.pageWrapper}>
        <div className={styles.container}>
          <h2>Login</h2>
          <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
            <input placeholder="Email" {...register("email")} className={styles.input}/>
            {errors.email && (
              <p className={styles.error}>{errors.email.message}</p>
            )}

            <PasswordInput
              register={register}
              name="password"
              placeholder="Password"
              error={errors.password}
            />
            {loginError && <p className={styles.error}>{loginError}</p>}

            <button type="submit">Login</button>
          </form>

          <div className={styles.signupRedirect}>
            <p className={styles.signUpText}>Not a member yet?</p>
            <button
              onClick={() => navigate("/signup")}
              className={styles.signupButton}
            >
              Sign Up
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}