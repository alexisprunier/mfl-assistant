import Menu from "bars/Menu";
import Page404 from "pages/Page404";
import PageDash from "pages/PageDash";
import PageDashClubs from "pages/pagedash/PageDashClubs.js";
import PageUserMap from "pages/pageuser/PageUserMap.js";
import PageDashGeneral from "pages/pagedash/PageDashGeneral.js";
import PageDashPlayers from "pages/pagedash/PageDashPlayers.js";
import PageHome from "pages/PageHome";
import PageNotification from "pages/PageNotification.js";
import PageNotificationPlayer from "pages/pagenotification/PageNotificationPlayer.js";
import PageNotificationClub from "pages/pagenotification/PageNotificationClub.js";
import PageNotificationReport from "pages/pagenotification/PageNotificationReport.js";
import PageSearch from "pages/PageSearch";
import PageTools from "pages/PageTools";
import PageToolsContractEvaluation from "pages/pagetools/PageToolsContractEvaluation.js";
import PageToolsPlayerPricing from "pages/pagetools/PageToolsPlayerPricing.js";
import PageUser from "pages/PageUser.js";
import PagePricing from "pages/PagePricing.js";
import PageMap from "pages/PageMap.js";
import PageUserClubs from "pages/pageuser/PageUserClubs.js";
import PageUserPlayers from "pages/pageuser/PageUserPlayers.js";
import React, { useState } from "react";
import { Route, Routes, useLocation, Navigate } from "react-router-dom";

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
            <Route path="/search" element={<PageSearch />} />
            <Route path="/pricing" element={<PagePricing />} />
            <Route path="user/:address" element={<PageUser {...props} yScrollPosition={yScrollPosition} />}>
              <Route index element={<Navigate to="players" replace />} />
              <Route path="players" element={<PageUserPlayers />} />
              <Route path="clubs" element={<PageUserClubs />} />
              <Route path="map" element={<PageUserMap />} />
            </Route>
            <Route path="dash" element={<PageDash yScrollPosition={yScrollPosition} />}>
              <Route index element={<Navigate to="general" replace />} />
              <Route path="general" element={<PageDashGeneral />} />
              <Route path="players" element={<PageDashPlayers />} />
              <Route path="clubs" element={<PageDashClubs />} />
            </Route>
            <Route path="tools" element={<PageTools yScrollPosition={yScrollPosition} />}>
              <Route index element={<Navigate to="player-pricing" replace />} />
              <Route path="player-pricing" element={<PageToolsPlayerPricing />} />
              <Route path="contract-evaluation" element={<PageToolsContractEvaluation />} />
            </Route>
            <Route path="notification" element={<PageNotification yScrollPosition={yScrollPosition} {...props} />}>
              <Route index element={<Navigate to="player" replace />} />
              <Route path="player" element={<PageNotificationPlayer {...props} />} />
              <Route path="club" element={<PageNotificationClub {...props} />} />
              <Route path="report" element={<PageNotificationReport {...props} />} />
            </Route>
            <Route path="/map" element={<PageMap {...props} />} />

            {/* 404 */}
            <Route element={<Page404 />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default Router;
