import Image from "next/image";
import iconRefresh from "../../public/assets/desktop/icon-refresh.svg";
import styles from "../page.module.css";

const IconRefresh = () => {
  return (
    <div className={styles["quote-refresh"]}>
      <Image src={iconRefresh} alt="icon refresh" priority />
    </div>
  );
};

export default IconRefresh;
