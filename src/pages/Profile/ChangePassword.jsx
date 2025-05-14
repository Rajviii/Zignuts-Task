import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import styles from "../../assets/styles/ChangePassword.module.css";
import CryptoJS from "crypto-js";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import PasswordInput from "../../components/common/PasswordInput";
import GoBackButton from "../../components/common/GoBackButton";
import Swal from "sweetalert2";

const schema = yup.object().shape({
  currentPassword: yup.string().required("Current password is required"),
  newPassword: yup
    .string()
    .required("New password is required")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,32}$/,
      "Password must be 8–32 chars, include uppercase, lowercase, number & special character"
    ),
  confirmNewPassword: yup
    .string()
    .oneOf([yup.ref("newPassword")], "Passwords must match")
    .required("Please confirm the new password"),
});

export default function ChangePassword() {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    const currentUser = localStorage.getItem("loggedInUser");
    if (!currentUser) {
      navigate("/login");
    }
  }, [navigate]);

  const onSubmit = (data) => {
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));

    if (!loggedInUser || !loggedInUser.password) {
      console.error("No password found for decryption");
      setError("currentPassword", {
        type: "manual",
        message: "Password not found",
      });
      return;
    }

    try {
      const decryptedPassword = CryptoJS.AES.decrypt(
        loggedInUser.password,
        "secret-key"
      );
      const decryptedText = decryptedPassword.toString(CryptoJS.enc.Utf8);

      if (!decryptedText) {
        console.error("Decryption failed, decrypted text is empty");
        setError("currentPassword", {
          type: "manual",
          message: "Decryption failed",
        });
        return;
      }

      if (decryptedText !== data.currentPassword) {
        setError("currentPassword", {
          type: "manual",
          message: "Incorrect current password",
        });
        return;
      }

      const encryptedNewPassword = CryptoJS.AES.encrypt(
        data.newPassword,
        "secret-key"
      ).toString();
      const updatedUsers = users.map((user) => {
        if (user.email === loggedInUser.email) {
          return { ...user, password: encryptedNewPassword };
        }
        return user;
      });

      const updatedLoggedInUser = {
        ...loggedInUser,
        password: encryptedNewPassword,
      };

      localStorage.setItem("users", JSON.stringify(updatedUsers));
      localStorage.setItem("loggedInUser", JSON.stringify(updatedLoggedInUser));

      navigate("/products");
      Swal.fire({
        title: "Password Change",
        text: "Password changed successfully",
        icon: "success",
        confirmButtonText: "OK",
        timer: 3000,
        timerProgressBar: true,
      });

    } catch (error) {
      console.error("Error during decryption:", error);
      setError("currentPassword", {
        type: "manual",
        message: "Failed to decrypt password",
      });
    }
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.pageWrapper}>
        <div className={styles.container}>
          <GoBackButton />
          <h2>Change Password</h2>
          <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
            <PasswordInput
              register={register}
              name="currentPassword"
              placeholder="Current Password"
              error={errors.currentPassword}
            />

            <PasswordInput
              register={register}
              name="newPassword"
              placeholder="New Password"
              error={errors.newPassword}
            />

            <PasswordInput
              register={register}
              name="confirmNewPassword"
              placeholder="Confirm New Password"
              error={errors.confirmNewPassword}
            />

            <button type="submit">Update Password</button>
          </form>
        </div>
      </div>
    </div>
  );
}