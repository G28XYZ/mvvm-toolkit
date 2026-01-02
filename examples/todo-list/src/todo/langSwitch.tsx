import React from "react";
import { useI18n } from "../i18n/I18nProvider";
import type { Lang } from "../i18n/messages";

export function LanguageSwitcher(): JSX.Element {
  const { lang, setLang, t } = useI18n();

  const items: { code: Lang; label: string }[] = [
    { code: "en", label: t("lang.en") },
    { code: "ru", label: t("lang.ru") },
  ];

  const pos = lang === "en" ? 0 : 1;

  return (
    <div
      className="langSwitch"
      style={{ ["--pos" as any]: pos } as React.CSSProperties}
      aria-label={t("lang.label")}
    >
      {/* key={lang} — перезапускает “squash” анимацию капли при переключении */}
      <span key={lang} className="langBlob" aria-hidden="true" />

      {items.map((it) => {
        const active = it.code === lang;
        return (
          <button
            key={it.code}
            type="button"
            className={`langBtn ${active ? "isActive" : ""}`}
            onClick={() => setLang(it.code)}
            aria-pressed={active}
          >
            {it.label}
          </button>
        );
      })}
    </div>
  );
}
