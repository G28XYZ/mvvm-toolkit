import { view } from "rvm-toolkit";
import { AuchanSearchView } from "./search";

export const AuchanView = view('auchan:MainVM', ({ viewModel: vm }) => {
  return (
    <div className="page">
      <AuchanSearchView />
    </div>
  );
})

