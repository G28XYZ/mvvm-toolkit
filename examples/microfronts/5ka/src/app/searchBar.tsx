import { view } from "rvm-toolkit";
import styles from "./styles.module.css";

export const ProductSearchBar = view('5ka:SearchVM', ({ viewModel: vm }) => {
  if (vm.hasExternalSearch) {
    return null;
  }

  return (
    <form
      className={styles.productSearch}
      onSubmit={(e) => {
        e.preventDefault();
        vm.search.execute(true)
      }}
    >
      <div className={styles.productSearch__row}>
        <input
          className   = {styles.productSearch__input}
          value       = {vm.parent.query}
          onChange    = {(e) => vm.updateQuery(e.target.value)}
          placeholder = "Название товара"
          aria-label  = "Название товара"
        />

        <button
          type       = "submit"
          className  = {[
            styles.productSearch__btn,
            vm.search.isExecuting ? styles.isLoading : ""
          ].filter(Boolean).join(" ")}
          disabled   = {!vm.search.canExecute}
          aria-label = "Искать"
          title      = "Искать"
        >
          Поиск
        </button>
      </div>
    </form>
  );
});
