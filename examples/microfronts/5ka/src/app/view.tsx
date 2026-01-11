import { view } from "rvm-toolkit";
import { ProductCard } from "./card";
import { ProductList } from "./list";
import { ProductSearchBar } from "./searchBar";
import styles from "./styles.module.css";

export const ProductView = view('5ka:ProductVM', ({ viewModel: vm }) => {
  return (

    <ProductCard>
      <div className={styles.productScreen}>
        <div className={styles.productCard}>
          <div className={styles.productCard__inner}>
            <header className={styles.productHeader}>
              <h1 className={styles.productHeader__title}>Товары</h1>
              {/* <div className="productHeader__right" aria-label="Корзина">
                В корзине: <strong>{vm.cartCount}</strong>
              </div> */}
            </header>
            <ProductSearchBar />
            <ProductList />
          </div>
        </div>
      </div>
    </ProductCard>
  );
});
