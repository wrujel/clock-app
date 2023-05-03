import Image from "next/image";
import iconMoon from "../../public/assets/desktop/icon-moon.svg";

const IconMoon = () => {
  return (
    <div>
      <Image src={iconMoon} alt="icon moon" priority />
    </div>
  );
};

export default IconMoon;
