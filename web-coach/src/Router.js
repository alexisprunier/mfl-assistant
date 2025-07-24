import Menu from "bars/Menu";
import Page404 from "pages/Page404";
import PageHome from "pages/PageHome";
import PageMatchAnalysis from "pages/PageMatchAnalysis.js";
import PageSquadBuilder from "pages/PageSquadBuilder.js";
import PageFormationMeta from "pages/PageFormationMeta.js";
import PageOpponentFinder from "pages/PageOpponentFinder.js";
import PageSearch from "pages/PageSearch.js";
import PageUser from "pages/PageUser.js";
import React, { useState } from "react";
import { Route, Routes, useLocation } from "react-router-dom";

const Router: React.FC = (props) => {
  const location = useLocation();
  const [yScrollPosition, setYScrollPosition] = useState(0);

  const handleScroll = (event) => {
    const { scrollTop } = event.target;
    const scroll = scrollTop;
    setYScrollPosition(scroll);
  };

  React.useEffect(() => {
    document.getElementById("AppContent-content").scroll({
      top: 0,
      behavior: "smooth",
    });
  }, [location.pathname]);

  return (
    <div id="Router" className="d-flex flex-column flex-lg-row h-100">
      <div id="AppMenu" className="order-2 order-lg-1">
        <Menu {...props} />
      </div>

      <div id="AppContent" className="order-1 order-lg-2 flex-fill">
        <div id="AppContent-content" className="position-relative h-100 w-100" onScroll={handleScroll}>
          <Routes>
            <Route
              path="/"
              element={
                <PageHome
                  flowUser={props.flowUser}
                  assistantUser={props.assistantUser}
                  updateAssistantUser={props.updateAssistantUser}
                  logout={props.logout}
                  yScrollPosition={yScrollPosition}
                  {...props}
                />
              }
            />
            <Route path="/match-analysis" element={<PageMatchAnalysis {...props} />} />
            <Route path="/squad-builder" element={<PageSquadBuilder {...props} />} />
            <Route path="/user/:address" element={<PageUser {...props} yScrollPosition={yScrollPosition} />} />
            <Route path="/formation-meta" element={<PageFormationMeta />} />
            <Route path="/opponent-finder" element={<PageOpponentFinder />} />
            <Route path="/search" element={<PageSearch />} />

            {/* 404 */}
            <Route element={<Page404 />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default Router;
