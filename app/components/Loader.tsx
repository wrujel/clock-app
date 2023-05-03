import styles from "../page.module.css";

const Loader = () => {
  return (
    <div className={styles["section-center-loading"]}>
      <div className={styles["sk-chase"]}>
        <div className={styles["sk-chase-dot"]}></div>
        <div className={styles["sk-chase-dot"]}></div>
        <div className={styles["sk-chase-dot"]}></div>
        <div className={styles["sk-chase-dot"]}></div>
        <div className={styles["sk-chase-dot"]}></div>
        <div className={styles["sk-chase-dot"]}></div>
      </div>
    </div>
  );
};

export default Loader;
