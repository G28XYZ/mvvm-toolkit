import { useId } from "react";
import styles from "./styles.module.css";
import { view } from "rvm-toolkit";
import { ProductCard } from "./card";



export const AuchanSearchView = view('auchan:SearchVM', ({ viewModel: vm }) => {

  const inputId = useId();

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div className={styles.titleRow}>
          <h1 className={styles.title}>Поиск товаров Ашан</h1>
        </div>
      </header>

      <section className={styles.panel}>
        <form
          className={styles.searchRow}
          onSubmit={(e) => {}}
        >
          <label className={styles.srOnly} htmlFor={inputId}>
            Поисковый запрос
          </label>

          <div className={styles.searchInputWrap}>
            <span className={styles.searchIcon} aria-hidden="true">⌕</span>
            <input
              id={inputId}
              className={styles.searchInput}
              // value={vm.query}
              onChange={(e) => {}}
              placeholder="Например: молоко, сыр, кофе…"
              autoComplete="off"
            />
          </div>

          <button
            className = {styles.primaryBtn}
            type      = "submit"
            disabled  = {vm.loading || vm.query.trim().length < 2}
            title     = {vm.query.trim().length < 2 ? "Минимум 2 символа" : "Искать"}
          >
            Искать
          </button>
        </form>

        <div className={styles.metaRow}>
          <div className={styles.metaLeft}>
            {/* <span className={styles.metaItem}>
              Найдено: <b>{vm.totalHits}</b>
            </span> */}
          </div>

          <div className={styles.metaRight}>
            {vm.loading ? <span className={styles.pill}>Загрузка…</span> : null}
          </div>
        </div>
      </section>

      <main className={styles.content}>

        <section className={styles.grid} aria-busy={vm.loading}>
          {vm.products.map((p) => <ProductCard key={`${p.id}-${p.groupId}`} product={p} />)}
        </section>
      </main>
    </div>
  );
})
