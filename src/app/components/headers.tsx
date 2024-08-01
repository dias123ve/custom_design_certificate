import Image from "next/image";
import Logo from "../../../public/logo.png";

export default function Headers() {
  return (
    <>
      <header className="h-[65px] w-full border border-black inline-flex justify-center items-center">
        <Image
          src={Logo}
          alt={""}
          className="size-[60px] object-contain"
        ></Image>
        <h1 className="text-[#32373b] font-semibold text-[20px]">Pelatihan</h1>
      </header>
    </>
  );
}
