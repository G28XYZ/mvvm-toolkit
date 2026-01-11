import { Disclosure, Transition, DisclosureButton } from "@headlessui/react";
import { type ViewProps, view } from "rvm-toolkit";
import type { InjectType } from "rvm-toolkit";
import type { Product } from "./types";
import styles from "./styles.module.css";

type Props = ViewProps<InjectType<'auchan:ProductItemVM'>, { item: Product }>;

function formatNumberLikePrice(value: string) {
  const raw = (value ?? "").trim();
  if (!raw) return "";
  const n = Number(raw.replace(",", "."));
  if (!Number.isFinite(n)) return raw;
  // без валюты — в diginetica приходит строка, валюта может быть неявной
  return new Intl.NumberFormat("ru-RU", { maximumFractionDigits: 2 }).format(n);
}

function toPairs(rec?: Record<string, string[]>) {
  if (!rec) return [];
  return Object.entries(rec).map(([k, v]) => [k, v.join(", ")] as const);
}

export const ProductItem = view('auchan:ProductItemVM', ({ viewModel: vm, item }: Props) => {
  const priceText = formatNumberLikePrice(item.price) || item.price;
  const oldPriceText = item.oldPrice ? formatNumberLikePrice(item.oldPrice) || item.oldPrice : "";

  const attrs = toPairs(item.attributes);
  const cats = item.categories ?? [];
  const skus = item.skus ?? [];

  return (
    <li
      className={[styles.productItem, vm.isAdded ? styles.isAdded : ""].filter(Boolean).join(" ")}
    >
      <Disclosure>
        {({ open }) => (
          <>
            <div className={styles.productItem__row}>
              <DisclosureButton className={styles.productItem__btn} aria-expanded={open}>
                <div className={styles.productItem__main}>
                  {item.image_url ? (
                    <img className={styles.productItem__img} src={item.image_url} alt="" />
                  ) : (
                    <div className={styles.productItem__imgStub} aria-hidden="true" />
                  )}

                  <div className={styles.productItem__text}>
                    <div className={styles.productItem__titleRow}>
                      <div className={styles.productItem__title}>{item.name}</div>
                      <div
                        className={[
                          styles.productItem__badge,
                          item.available ? "" : styles.isOff,
                        ]
                          .filter(Boolean)
                          .join(" ")}
                      >
                        {item.available ? "В наличии" : "Нет в наличии"}
                      </div>
                    </div>

                    <div className={styles.productItem__sub}>
                      <span className={styles.productItem__price}>
                        {oldPriceText ? (
                          <>
                            <span className={styles.productItem__oldPrice}>{oldPriceText}</span>{" "}
                            <span className={styles.productItem__priceNow}>{priceText}</span>
                          </>
                        ) : (
                          priceText
                        )}
                      </span>

                      {item.brand ? (
                        <span className={styles.productItem__brand}>· {item.brand}</span>
                      ) : null}
                    </div>
                  </div>
                </div>
              </DisclosureButton>

              {/* <button
                type="button"
                className={[
                  styles.productItem__addBtn,
                  vm.isAdded ? styles.isAdded : ""
                ].filter(Boolean).join(" ")}
                disabled={!vm.canAdd}
                onClick={(e) => {
                  e.preventDefault();
                  vm.add();
                }}
                aria-label={vm.isAdded ? "Добавлено" : "Добавить"}
                title={vm.isAdded ? "Добавлено" : "Добавить"}
              >
                {vm.isAdded ? "Добавлено" : "Добавить"}
              </button> */}
            </div>

            <Transition
              show={open}
              enter={styles.productTransitionEnter}
              enterFrom={styles.productTransitionEnterFrom}
              enterTo={styles.productTransitionEnterTo}
              leave={styles.productTransitionLeave}
              leaveFrom={styles.productTransitionLeaveFrom}
              leaveTo={styles.productTransitionLeaveTo}
            >
              <Disclosure.Panel className={styles.productItem__panel}>
                <div className={styles.productItem__details}>
                  <dl className={styles.productItem__dl}>
                    <dt>ID</dt>
                    <dd>{item.id}</dd>

                    <dt>Group</dt>
                    <dd>{item.groupId}</dd>

                    {item.link_url ? (
                      <>
                        <dt>Ссылка</dt>
                        <dd>
                          <a
                            className={styles.productItem__link}
                            href={item.link_url}
                            target="_blank"
                            rel="noreferrer"
                          >
                            Открыть
                          </a>
                        </dd>
                      </>
                    ) : null}

                    {cats.length ? (
                      <>
                        <dt>Категории</dt>
                        <dd>
                          <div className={styles.productItem__chips}>
                            {cats.map((c) => (
                              <span
                                key={c.id}
                                className={[
                                  styles.productItem__chip,
                                  c.direct ? styles.isDirect : ""
                                ].filter(Boolean).join(" ")}
                              >
                                {c.name}
                              </span>
                            ))}
                          </div>
                        </dd>
                      </>
                    ) : null}

                    {attrs.length ? (
                      <>
                        <dt>Атрибуты</dt>
                        <dd>
                          <div className={styles.productItem__kv}>
                            {attrs.map(([k, v]) => (
                              <div key={k} className={styles.productItem__kvRow}>
                                <span className={styles.productItem__kvKey}>{k}</span>
                                <span className={styles.productItem__kvVal}>{v}</span>
                              </div>
                            ))}
                          </div>
                        </dd>
                      </>
                    ) : null}

                    {skus.length ? (
                      <>
                        <dt>SKU</dt>
                        <dd>
                          <ul className={styles.productItem__skuList}>
                            {skus.map((s) => (
                              <li key={s.id} className={styles.productItem__sku}>
                                <div className={styles.productItem__skuTop}>
                                  <span className={styles.productItem__skuName}>{s.name}</span>
                                  <span
                                    className={[
                                      styles.productItem__skuBadge,
                                      s.available ? "" : styles.isOff,
                                    ]
                                      .filter(Boolean)
                                      .join(" ")}
                                  >
                                    {s.available ? "В наличии" : "Нет"}
                                  </span>
                                </div>
                                <div className={styles.productItem__skuBottom}>
                                  {s.oldPrice ? (
                                    <>
                                      <span className={styles.productItem__oldPrice}>
                                        {formatNumberLikePrice(s.oldPrice) || s.oldPrice}
                                      </span>{" "}
                                      <span className={styles.productItem__priceNow}>
                                        {formatNumberLikePrice(s.price) || s.price}
                                      </span>
                                    </>
                                  ) : (
                                    <span>{formatNumberLikePrice(s.price) || s.price}</span>
                                  )}
                                </div>

                                {s.attributes ? (
                                  <div className={styles.productItem__skuAttrs}>
                                    {toPairs(s.attributes).map(([k, v]) => (
                                      <div key={k} className={styles.productItem__kvRow}>
                                        <span className={styles.productItem__kvKey}>{k}</span>
                                        <span className={styles.productItem__kvVal}>{v}</span>
                                      </div>
                                    ))}
                                  </div>
                                ) : null}
                              </li>
                            ))}
                          </ul>
                        </dd>
                      </>
                    ) : null}
                  </dl>
                </div>
              </Disclosure.Panel>
            </Transition>
          </>
        )}
      </Disclosure>
    </li>
  );
});
