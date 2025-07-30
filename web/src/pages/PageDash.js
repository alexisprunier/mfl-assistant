import React from "react";
import { Outlet } from "react-router-dom";
import MenuPageDash from "bars/MenuPageDash.js";
import BoxScrollUp from "components/box/BoxScrollUp.js";

interface PageDashProps {
  yScrollPosition: number;
}

const PageDash: React.FC<PageDashProps> = ({ yScrollPosition }) => {
  return (
    <div id="PageDash" className="w-100 h-100">
      {yScrollPosition > 100 && <BoxScrollUp />}

      <div className="d-flex flex-column w-100 h-100">
        <div className="flex-shrink-0">
          <MenuPageDash />
        </div>

        <div className="flex-grow-1 overflow-auto">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default PageDash;
