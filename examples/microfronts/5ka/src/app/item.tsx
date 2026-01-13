import { Disclosure, Transition, DisclosureButton } from "@headlessui/react";
import { type ViewProps, view } from "rvm-toolkit";
import type { InjectType } from "rvm-toolkit";
import type { FiveKaImageLinks, Product } from "./types";
import styles from "./styles.module.css";

type Props = ViewProps<InjectType<"5ka:ProductItemVM">, { item: Product }>;

function formatNumberLikePrice(value: string) {
  const raw = (value ?? "").trim();
  if (!raw) return "";
  const n = Number(raw.replace(",", "."));
  if (!Number.isFinite(n)) return raw;
  return new Intl.NumberFormat("ru-RU", { maximumFractionDigits: 2 }).format(n);
}

function resolveImageUrl(links?: FiveKaImageLinks) {
  return links?.normal?.[0] || links?.small?.[0] || "";
}

export const ProductItem = view("5ka:ProductItemVM", ({ viewModel: vm, item }: Props) => {
  const imageUrl     = resolveImageUrl(item.image_links);
  const regularPrice = item.prices?.regular ?? "";
  const promoPrice   = item.prices?.discount ?? item.prices?.cpd_promo_price ?? "";
  const hasPromo     = Boolean(promoPrice && regularPrice && promoPrice !== regularPrice);
  const priceText    = formatNumberLikePrice(hasPromo ? promoPrice : regularPrice) || promoPrice || regularPrice;
  const oldPriceText = hasPromo ? formatNumberLikePrice(regularPrice) || regularPrice : "";
  const available    = item.is_available ?? true;
  const labels       = item.labels ?? [];

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
                  {imageUrl ? (
                    <img className={styles.productItem__img} src={imageUrl} alt="" />
                  ) : (
                    <div className={styles.productItem__imgStub} aria-hidden="true" />
                  )}

                  <div className={styles.productItem__text}>
                    <div className={styles.productItem__titleRow}>
                      <div className={styles.productItem__title}>{item.name}</div>
                      <div
                        className={[
                          styles.productItem__badge,
                          available ? "" : styles.isOff,
                        ]
                          .filter(Boolean)
                          .join(" ")}
                      >
                        {available ? "В наличии" : "Нет в наличии"}
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
                      {item.property_clarification ? (
                        <span className={styles.productItem__brand}>
                          · {item.property_clarification}
                        </span>
                      ) : null}
                    </div>
                  </div>
                </div>
              </DisclosureButton>
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
                    <dt>PLU</dt>
                    <dd>{item.plu}</dd>

                    {item.uom ? (
                      <>
                        <dt>Ед. измерения</dt>
                        <dd>{item.uom}</dd>
                      </>
                    ) : null}

                    {item.step ? (
                      <>
                        <dt>Шаг</dt>
                        <dd>{item.step}</dd>
                      </>
                    ) : null}

                    {item.stock_limit ? (
                      <>
                        <dt>Ограничение по остатку</dt>
                        <dd>{item.stock_limit}</dd>
                      </>
                    ) : null}

                    {item.orange_loyalty_points != null ? (
                      <>
                        <dt>Баллы лояльности</dt>
                        <dd>{item.orange_loyalty_points}</dd>
                      </>
                    ) : null}

                    {item.rating ? (
                      <>
                        <dt>Рейтинг</dt>
                        <dd>
                          {item.rating.rating_average} · {item.rating.rates_count} оценок
                        </dd>
                      </>
                    ) : null}

                    {item.price_piece_unit ? (
                      <>
                        <dt>Цена за единицу</dt>
                        <dd>{item.price_piece_unit}</dd>
                      </>
                    ) : null}

                    {labels.length ? (
                      <>
                        <dt>Метки</dt>
                        <dd>
                          <div className={styles.productItem__chips}>
                            {labels.map((label) => (
                              <span
                                key={label.label}
                                className={styles.productItem__chip}
                                style={{
                                  backgroundColor: label.bg_color,
                                  color: label.text_color,
                                  borderColor: label.bg_color,
                                }}
                              >
                                {label.label}
                              </span>
                            ))}
                          </div>
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
