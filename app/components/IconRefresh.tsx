import Image from "next/image";
import iconRefresh from "../../public/assets/desktop/icon-refresh.svg";

const IconRefresh = () => {
  return <Image src={iconRefresh} alt="" width={18} height={18} priority />;
};

export default IconRefresh;
