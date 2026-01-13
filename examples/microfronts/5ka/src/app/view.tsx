import { view } from "rvm-toolkit";
import { ProductList } from "./list";
import { ProductSearchBar } from "./searchBar";
import styles from "./styles.module.css";

export const ProductView = view('5ka:ProductVM', ({ viewModel: vm }) => {
  return (
    <>
      <header className={styles.productHeader}>
        <h1 className={styles.productHeader__title}>Товары</h1>
        {/* <div className="productHeader__right" aria-label="Корзина">
          В корзине: <strong>{vm.cartCount}</strong>
        </div> */}
      </header>
      <ProductSearchBar />
      <ProductList />
    </>
  );
});
