import Image from "next/image";

<div>
  {/* Add Hero Images Here */}
  <Image
    src="/hero-desktop.png"
    width={500}
    height={380}
    className="hidden md:block"
    alt="Screenshots of the dashboard project showing desktop version"
  />
  <Image
    src="/hero-mobile.png"
    width={560}
    height={620}
    className="block md:hidden"
    alt="Screenshot of the dashboard project showing mobile version"
  />
</div>;
