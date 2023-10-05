import css from "./Header.module.css";

export default function Header() {
  return (
    <header className={css.headerCont}>
      <a href="/" className={css.logoTitle}>
        <svg className={css.logoSvg}>
            <use href={`/sprite.svg#icon-tower`}></use>
        </svg>
        InfoCitadel
      </a>
    </header>
  );
}
