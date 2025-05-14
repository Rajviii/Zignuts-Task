import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import styles from "../../assets/styles/Navbar.module.css";
import zignutsLogo from "../../imges/zignuts-logo.png";
import { useAuth } from "../../context/AuthContext";

export default function Navbar() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  const { authUser, logout } = useAuth();

  const isPublic = ["/login", "/signup", "/"].includes(location.pathname);

  useEffect(() => {
    setDropdownOpen(false);
  }, [location]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!dropdownRef.current?.contains(e.target)) setDropdownOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  if (isPublic) return null;

  return (
    <div className={styles.wrapper}>
      <div className={styles.pageWrapper}>
        <nav className={styles.navbar}>
          <div className={styles.left}>
            <img src={zignutsLogo} alt="Zignuts Logo" className={styles.logoImage} />
            <Link to="/products" className={styles.logo}>
              Zignuts
            </Link>
          </div>
          <div className={styles.right}>
            {authUser && (
              <div className={styles.profileWrapper} ref={dropdownRef}>
                <button
                  className={styles.nameBtn}
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                >
                  {authUser.firstName} {authUser.lastName}
                </button>
                {dropdownOpen && (
                  <div className={styles.dropdown}>
                    <Link to="/edit-profile" className={styles.dropdownItem}>
                      Edit Profile
                    </Link>
                    <Link to="/change-password" className={styles.dropdownItem}>
                      Change Password
                    </Link>
                  </div>
                )}
              </div>
            )}
            <button className={styles.logoutBtn} onClick={handleLogout}>
              Logout
            </button>
          </div>
        </nav>
      </div>
    </div>
  );
}