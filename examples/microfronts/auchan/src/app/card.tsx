import styles from "./styles.module.css";
import { InjectType, view, ViewProps } from "rvm-toolkit";
import { DigineticaProduct } from "./types";

type Props = ViewProps<InjectType<'auchan:CardVM'>, { product: DigineticaProduct }>

export const ProductCard = view('auchan:CardVM', ({ viewModel: vm, product }: Props) => {

  return (
    <article className={styles.card}>
      <div className={styles.media}>
        {/* <img className={styles.image} loading="lazy" /> */}
        <span className={product.available ? styles.availOk : styles.availNo}>
          {product.available ? "в наличии" : "нет"}
        </span>
      </div>

      <div className={styles.body}>
        <div className={styles.name} title={product.name}>
          {product.name}
        </div>

        <div className={styles.priceRow}>
          <div className={styles.price}>{product.price}</div>
          {product.oldPrice ? <div className={styles.oldPrice}>{product.oldPrice}</div> : null}
        </div>

        {product.brand ? <div className={styles.brand}>{product.brand}</div> : null}

        <div className={styles.actions}>
          {product.link_url ? (
            <a className={styles.linkBtn} href={product.link_url} target="_blank" rel="noreferrer">
              Открыть ↗
            </a>
          ) : (
            <button className={styles.linkBtn} type="button" disabled>
              Нет ссылки
            </button>
          )}

          <button className={styles.iconBtn} type="button" aria-label="В избранное" title="В избранное">
            ☆
          </button>
        </div>
      </div>
    </article>
  );
})
