import React from "react";
import { useI18n } from "../i18n/I18nProvider";

type Props = React.PropsWithChildren;

export function TodoCard({ children }: Props): JSX.Element {
  const { t } = useI18n();

  return (
    <div className="paperStack" role="application" aria-label={t("a11y.todoApp")}>
      <div className="paper">{children}</div>
    </div>
  );
}
