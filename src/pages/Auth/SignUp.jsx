import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import styles from "../../assets/styles/Signup.module.css";
import CryptoJS from "crypto-js";
import Swal from "sweetalert2";
import PasswordInput from "../../components/common/PasswordInput";
import { useAuth } from "../../context/AuthContext";

const noHTML = yup.string().matches(/^[^<>]*$/, "HTML tags are not allowed");

const schema = yup.object().shape({
  firstName: noHTML.required("First name is required"),
  lastName: noHTML.required("Last name is required"),
  email: yup
    .string()
    .email("Invalid email")
    .required("Email is required")
    .matches(/^[^<>]*$/, "HTML tags are not allowed"),
  mobile: yup
    .string()
    .matches(/^\d{10}$/, "Mobile number must be exactly 10 digits")
    .required("Mobile number is required"),
  password: yup
    .string()
    .required("Password is required")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,32}$/,
      "Password must meet complexity requirements"
    ),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password")], "Passwords must match")
    .required("Confirm password is required"),
});

export default function SignUp() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = (data) => {
    const existingUsers = JSON.parse(localStorage.getItem("users")) || [];

    const emailExists = existingUsers.some((user) => user.email === data.email);
    if (emailExists) {
      setError("email", { type: "manual", message: "Email already exists" });
      return;
    }

    const encryptedPassword = CryptoJS.AES.encrypt(
      data.password,
      "secret-key"
    ).toString();

    const newUser = {
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      mobile: data.mobile,
      password: encryptedPassword,
    };

    const updatedUsers = [...existingUsers, newUser];
    localStorage.setItem("users", JSON.stringify(updatedUsers));

    const foundUser = updatedUsers.find((user) => user.email === data.email);
    login(foundUser);

    Swal.fire({
      title: "SignUp and Login!",
      text: "Signup successful, you are now logged in",
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
          <h2>Signup</h2>
          <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
            <input placeholder="First Name" {...register("firstName")} />
            {errors.firstName && (
              <p className={styles.error}>{errors.firstName.message}</p>
            )}

            <input placeholder="Last Name" {...register("lastName")} />
            {errors.lastName && (
              <p className={styles.error}>{errors.lastName.message}</p>
            )}

            <input placeholder="Email" {...register("email")} />
            {errors.email && (
              <p className={styles.error}>{errors.email.message}</p>
            )}

            <input
              placeholder="Mobile"
              {...register("mobile", {
                onChange: (e) => {
                  const onlyNumbers = e.target.value.replace(/\D/g, "");
                  e.target.value = onlyNumbers;
                },
              })}
              maxLength={10}
            />
            {errors.mobile && (
              <p className={styles.error}>{errors.mobile.message}</p>
            )}

            <PasswordInput
              register={register}
              name="password"
              placeholder="Password"
              error={errors.password}
            />

            <PasswordInput
              register={register}
              name="confirmPassword"
              placeholder="Confirm Password"
              error={errors.confirmPassword}
            />

            <button type="submit">Signup</button>
          </form>
        </div>
      </div>
    </div>
  );
}