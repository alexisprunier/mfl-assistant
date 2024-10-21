import React, { useState, useEffect } from 'react';
import { getPlayerSales, getPlayerListings } from "services/api-mfl.js";
import LoadingSquare from "components/loading/LoadingSquare.js";
import MiscHorizontalScroll from "components/misc/MiscHorizontalScroll.js";
import ItemCardSale from "components/items/ItemCardSale.js";

interface BoxMflActivityProps {}

const BoxMflActivity: React.FC < BoxMflActivityProps > = () => {

    const [playerSales, setPlayerSales] = useState(null);
    const [playerListings, setPlayerListings] = useState(null);

    const getPlayerSalesData = () => {
      getPlayerSales({
        handleSuccess: (v) => {
          setPlayerSales(v);
        },
        handleError: (e) => {
          console.log(e);
        },
        params: {}
      });
    }

    const getPlayerListingData = () => {
      getPlayerListings({
        handleSuccess: (v) => {
          setPlayerListings(v);
        },
        handleError: (e) => {
          console.log(e);
        },
        params: {}
      });
    }

    useEffect(() => {
      getPlayerSalesData();
      getPlayerListingData();
    }, []);

    return (
      <div>
      <h4><i className="bi bi-activity me-1"></i> MFL Activity</h4>

      <div className="d-flex flex-column flex-fill">
        <div className="d-flex flex-column flex-grow-1 mb-1">
          <div>
            Latest listings
          </div>

          <div className="d-flex flex-row">
            {playerListings
              ? <MiscHorizontalScroll
                content={
                  <div className="d-flex flex-row">
                    {playerListings.map((o) => (
                      <div>
                        <ItemCardSale
                          s={o}
                        />
                      </div>
                    ))}
                  </div>
                }
              />
              : <div className="w-100" style={{ height: "95px" }}>
                <LoadingSquare />
              </div>
            }
          </div>
        </div>

      <
      div className = "d-flex flex-column flex-grow-1" >
      <div>
            Latest sales
          </div>

      <
      div className = "d-flex flex-row" > {
        playerSales ?
        <MiscHorizontalScroll
                content={
                  <div className="d-flex flex-row">
                    {playerSales.map((o) => (
                      <div>
                        <ItemCardSale
                          s={o}
                        /> <
        /div>
      ))
  } <
  /div>
}
/>: <div className="w-100" style={{ height: "95px" }}> <
LoadingSquare / >
  <
  /div>
} <
/div> < /
div > <
  /div> < /
div >
);
};

export default BoxMflActivity;