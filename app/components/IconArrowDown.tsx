import Image from "next/image";
import iconArrowDown from "../../public/assets/desktop/icon-arrow-down.svg";

const IconArrowDown = () => {
  return <Image src={iconArrowDown} alt="" width={16} height={8} priority />;
};

export default IconArrowDown;
