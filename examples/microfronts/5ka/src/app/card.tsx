import type React from "react";
import styles from "./styles.module.css";

type Props = React.PropsWithChildren;

export function ProductCard({ children }: Props): JSX.Element {
  return (
    <div className={styles.productCard} role="application" aria-label="Product search">
      <div className={styles.productCard__inner}>{children}</div>
    </div>
  );
}
