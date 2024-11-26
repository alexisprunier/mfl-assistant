import React, { useState } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Menu from "bars/Menu";
import PageSearch from "pages/PageSearch";
import PageHome from "pages/PageHome";
import PageDash from "pages/PageDash";
import PageTools from "pages/PageTools";
import PageNotification from "pages/PageNotification.js";
import PageUser from "pages/PageUser.js";
import PageUserPlayers from "pages/pageuser/PageUserPlayers.js";
import PageUserClubs from "pages/pageuser/PageUserClubs.js";
import Page404 from "pages/Page404";
import PageDashPlayers from "pages/pagedash/PageDashPlayers.js";
import PageDashMarketplace from "pages/pagedash/PageDashMarketplace.js";
import PageDashClubs from "pages/pagedash/PageDashClubs.js";
import PageDashMap from "pages/pagedash/PageDashMap.js";
import PageToolsContractEvaluation from "pages/pagetools/PageToolsContractEvaluation.js";
import PageToolsPlayerPricing from "pages/pagetools/PageToolsPlayerPricing.js";
import PageToolsTeamBuilder from "pages/pagetools/PageToolsTeamBuilder.js";


const Router: React.FC = (props) => {
  const location = useLocation();
  const [yScrollPosition, setYScrollPosition] = useState(0);

  const handleScroll = (event) => {
    const { scrollTop } = event.target;
    const scroll = scrollTop;
    setYScrollPosition(scroll);
  }

  React.useEffect(() => {
    document.getElementById("AppContent-content")
      .scroll({
        top: 0,
        behavior: "smooth",
      });
  }, [location.pathname]);

  return (
    <div id="Router" className="d-flex flex-column flex-md-row h-100">
      <div id="AppMenu" className="order-2 order-md-1">
        <Menu
          {...props}
        />
      </div>

      <div
        id="AppContent"
        className="order-1 order-md-2 flex-fill"
      >
        <div
          id="AppContent-content"
          className="position-relative h-100 w-100"
          onScroll={handleScroll}
        >
          <Routes>
            <Route
              path="/"
              element={<PageHome
                yScrollPosition={yScrollPosition}
              />}
            />
            <Route
              path="/search"
              element={<PageSearch />}
            />
            <Route
              path="user/:address"
              element={<PageUser
                {...props}
                yScrollPosition={yScrollPosition}
              />}
            >
              <Route
                index
                element={<PageUserPlayers />}
              />
              <Route
                path="players"
                element={<PageUserPlayers />}
              />
              <Route
                path="clubs"
                element={<PageUserClubs />}
              />
            </Route>
            <Route
              path="dash"
              element={<PageDash
                yScrollPosition={yScrollPosition}
              />}
            >
              <Route
                index
                element={<PageDashMarketplace />}
              />
              <Route
                path="marketplace"
                element={<PageDashMarketplace />}
              />
              <Route
                path="players"
                element={<PageDashPlayers />}
              />
              <Route
                path="clubs"
                element={<PageDashClubs />}
              />
              <Route
                path="map"
                element={<PageDashMap />}
              />
            </Route>
            <Route
              path="tools"
              element={<PageTools
                yScrollPosition={yScrollPosition}
              />}
            >
              <Route
                index
                element={<PageToolsPlayerPricing
                  {...props}
                />}
              />
              {<Route
                path="player-pricing"
                element={<PageToolsPlayerPricing />}
              />}
              <Route
                path="team-builder"
                element={<PageToolsTeamBuilder
                  {...props}
                />}
              />
              <Route
                path="contract-evaluation"
                element={<PageToolsContractEvaluation />}
              />
            </Route>
            <Route
              path="notification"
              element={<PageNotification
                {...props}
              />}
            />

            {/* 404 */}
            <Route
              element={<Page404 />}
            />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default Router;