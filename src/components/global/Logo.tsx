import Image from "next/image";
import Link from "next/link";

type LogoProps = {
  className?: string;
  isLink?: boolean;
};

export function LogoImage({ className, isLink }: LogoProps) {
  if (isLink) {
    return (
      <Link href="/">
        <Image
          src="https://www.miracleibharokhonre.com/images/mylogo.png"
          alt="MOJI School Logo"
          width={100}
          height={100}
          className={className}
          priority
        />
      </Link>
    );
  }

  return (
    <Image
      src="https://www.miracleibharokhonre.com/images/mylogo.png"
      alt="MOJI School Logo"
      width={100}
      height={100}
      priority
      className={className}
    />
  );
}

export function LogoText({ className, isLink }: LogoProps) {
  if (isLink) {
    return (
      <Link href="/" className={`flex items-center gap-2 ${className}`}>
        <LogoImage />
        <h1 className="text-xl uppercase font-semibold  tracking-tight">
          MOJI School
        </h1>
      </Link>
    );
  }

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <LogoImage />
      <h1 className="text-xl uppercase font-semibold  tracking-tight">
        MOJI School
      </h1>
    </div>
  );
}
