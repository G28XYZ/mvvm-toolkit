import { LanguageSwitcher } from "./langSwitch";

type Props = {
  title: string;
};

export function TodoHeader({ title }: Props): JSX.Element {
  return (
    <header className="todoHeader">
      <h1 className="todoHeader__title">{title}</h1>
      <div className="todoHeader__right">
        <LanguageSwitcher />
      </div>
    </header>
  );
}
