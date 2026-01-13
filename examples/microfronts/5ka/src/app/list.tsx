import { view } from "rvm-toolkit";
import { useVirtualScroller } from "rvm-toolkit/hooks";
import { ProductItem } from "./item";
import styles from "./styles.module.css";
import { useRef } from "react";

export const ProductList = view('5ka:ProductListVM', ({ viewModel: vm }) => {
  const hasQuery = Boolean(vm.auchanSearch.lastQuery.trim());
  const ulRef = useRef();

  useVirtualScroller({ targetRef: ulRef, overscan: 15, rowHeight: 66 });

  return (
    <>
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
          <ul ref={ulRef} className={styles.productList} aria-label="Результаты поиска">
            {vm.items.map((p) => (
              <ProductItem key={p.plu} item={p} />
            ))}
          </ul>
        )}
      </div>
    </>
  );
});
