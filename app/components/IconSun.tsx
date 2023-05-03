import Image from "next/image";
import iconSun from "../../public/assets/desktop/icon-sun.svg";

const IconSun = () => {
  return (
    <div>
      <Image src={iconSun} alt="icon sun" priority />
    </div>
  );
};

export default IconSun;
