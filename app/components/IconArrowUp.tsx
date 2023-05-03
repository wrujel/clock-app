import Image from "next/image";
import iconArrowUp from "../../public/assets/desktop/icon-arrow-up.svg";
import styles from "../page.module.css";

interface Props {
  info: boolean;
}

const IconArrowUp: React.FC<Props> = ({ info }) => {
  return (
    <div>
      <Image
        src={iconArrowUp}
        alt="icon arrow up"
        priority
        className={styles["btn-image"]}
        data-visible={!info}
        width={18}
        height={9}
      />
    </div>
  );
};

export default IconArrowUp;
