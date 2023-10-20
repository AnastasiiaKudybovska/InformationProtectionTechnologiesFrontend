import Link from "next/link";
import css from "./Header.module.css";

export default function Header() {
  return (
    <header className={css.headerCont}>
      <div className={css.headerWrapper}>
        <Link href="/" className={css.logoTitle}>
          <svg className={css.logoSvg}>
            <use href={`/sprite.svg#icon-tower`}></use>
          </svg>
          InfoCitadel
        </Link>
        <div className={css.link}>
          <Link href="/">Linear Congruential Generator</Link>
          <Link href="/md5">MD5 Hash Generator</Link>
        </div>
      </div>
     
    </header>
  );
}
