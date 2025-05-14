import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import styles from "../../assets/styles/EditProfile.module.css";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import GoBackButton from "../../components/common/GoBackButton";

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
});

export default function EditProfile() {
  const navigate = useNavigate();
  const [originalEmail, setOriginalEmail] = useState("");

  const {
    register,
    handleSubmit,
    setError,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem("loggedInUser"));
    if (!currentUser) return navigate("/login");

    reset({
      firstName: currentUser.firstName,
      lastName: currentUser.lastName,
      email: currentUser.email,
      mobile: currentUser.mobile,
    });
    setOriginalEmail(currentUser.email);
  }, [navigate, reset]);

  const onSubmit = (data) => {
    const users = JSON.parse(localStorage.getItem("users")) || [];

    const emailExists = users.some(
      (user) => user.email === data.email && user.email !== originalEmail
    );

    if (emailExists) {
      setError("email", {
        type: "manual",
        message: "Email already in use by another account",
      });
      return;
    }

    const updatedUsers = users.map((user) => {
      if (user.email === originalEmail) {
        return { ...user, ...data };
      }
      return user;
    });

    localStorage.setItem("users", JSON.stringify(updatedUsers));
    localStorage.setItem("loggedInUser", JSON.stringify({ ...data }));

    Swal.fire({
      title: "Profile Updated",
      text: "Your profile has been updated successfully",
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
          <GoBackButton />
          <h2>Edit Profile</h2>
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

            <button type="submit">Update Profile</button>
          </form>
        </div>
      </div>
    </div>
  );
}
