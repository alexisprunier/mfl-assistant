import React, { useState } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Menu from "bars/Menu";
import PageSearch from "pages/PageSearch";
import PageHome from "pages/PageHome";
import PageDash from "pages/PageDash";
import PageMercato from "pages/PageMercato";
import PageNotification from "pages/PageNotification.js";
import Page404 from "pages/Page404";
import PageDashPlayers from "pages/pagedash/PageDashPlayers.js";
import PageDashCompetitions from "pages/pagedash/PageDashCompetitions.js";
import PageDashClubs from "pages/pagedash/PageDashClubs.js";
import PageDashMap from "pages/pagedash/PageDashMap.js";
import PageMercatoContracts from "pages/pagemercato/PageMercatoContracts.js";
import PageMercatoSales from "pages/pagemercato/PageMercatoSales.js";

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
    <div id="Router" className="d-flex flex-column flex-md-row vh-100">
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
              path="dash"
              element={<PageDash
                yScrollPosition={yScrollPosition}
              />}
            >
              <Route
                index
                element={<PageDashPlayers />}
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
                path="competitions"
                element={<PageDashCompetitions />}
              />
              <Route
                path="map"
                element={<PageDashMap />}
              />
            </Route>
            <Route
              path="mercato"
              element={<PageMercato
                yScrollPosition={yScrollPosition}
              />}
            >
              <Route
                index
                element={<PageMercatoContracts />}
              />
              <Route
                path="contracts"
                element={<PageMercatoContracts />}
              />
              <Route
                path="sales"
                element={<PageMercatoSales />}
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