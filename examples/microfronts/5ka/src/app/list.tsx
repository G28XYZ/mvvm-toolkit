import { view } from "rvm-toolkit";
import { ProductItem } from "./item";
import styles from "./styles.module.css";

export const ProductList = view('5ka:ProductListVM', ({ viewModel: vm }) => {
  const hasQuery = Boolean(vm.lastQuery.trim());

  return (
    <div className={styles.productListWrap}>
      {hasQuery && (
        <div className={styles.productListWrap__meta} aria-live="polite">
          Найдено: <strong>{vm.items?.length}</strong>
          {vm.correction ? (
            <span className={styles.productListWrap__correction}>
              {" "}
              · Возможно, вы имели в виду: <strong>{vm.correction}</strong>
            </span>
          ) : null}
        </div>
      )}

      <div className={styles.productListWrap__scroll}>
        {vm.resultCount === 0 ? (
          <div className={styles.productListWrap__empty}>
            {hasQuery ? "Ничего не найдено" : "Введите название товара и нажмите «Поиск»."}
          </div>
        ) : (
          <ul className={styles.productList} aria-label="Результаты поиска">
            {vm.items.map((p) => (
              <ProductItem key={p.plu} item={p} />
            ))}
          </ul>
        )}
      </div>
    </div>
  );
});
