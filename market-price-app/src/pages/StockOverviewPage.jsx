import React from "react";
import { AutoComplete } from "../components/AutoComplete";
import { Stocklist } from "../components/Stocklist";
export const StockOverviewPage = () => {
  return (
    <div>
      <AutoComplete />
      <Stocklist />
    </div>
  );
};
