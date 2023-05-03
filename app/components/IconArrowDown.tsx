import Image from "next/image";
import iconArrowDown from "../../public/assets/desktop/icon-arrow-down.svg";
import styles from "../page.module.css";

interface Props {
  info: boolean;
}

const IconArrowDown: React.FC<Props> = ({ info }) => {
  return (
    <div>
      <Image
        src={iconArrowDown}
        alt="icon arrow down"
        priority
        className={styles["btn-image"]}
        data-visible={!info}
        width={18}
        height={9}
      />
    </div>
  );
};

export default IconArrowDown;
