import React from "react";
import { Outlet } from "react-router-dom";
import MenuPageTools from "bars/MenuPageTools.js";
import BoxScrollUp from "components/box/BoxScrollUp.js";

interface PageToolsProps {
  yScrollPosition: number;
}

const PageTools: React.FC<PageToolsProps> = ({ yScrollPosition }) => {
  return (
    <div id="PageTools" className="w-100 h-100">
      {yScrollPosition > 100 && <BoxScrollUp />}

      <div className="d-flex flex-column w-100 h-100">
        <div className="flex-shrink-0">
          <MenuPageTools />
        </div>

        <div className="flex-grow-1 overflow-auto">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default PageTools;
