import ItemCardSale from "components/items/ItemCardSale.js";
import LoadingSquare from "components/loading/LoadingSquare.js";
import MiscHorizontalScroll from "components/misc/MiscHorizontalScroll.js";
import React, { useEffect, useState } from "react";
import { getPlayerListings, getPlayerSales } from "services/api-mfl.js";
import "./BoxMflActivity.css";

interface BoxMflActivityProps {}

const BoxMflActivity: React.FC<BoxMflActivityProps> = () => {
  const [playerSales, setPlayerSales] = useState(null);
  const [playerListings, setPlayerListings] = useState(null);

  const [updatingSales, setUpdatingSales] = useState(false);
  const [updatingListings, setUpdatingListings] = useState(false);

  const getPlayerSalesData = () => {
    setUpdatingSales(true);

    getPlayerSales({
      handleSuccess: (v) => {
        if (playerSales === null || playerSales.length === 0) {
          setPlayerSales(v);
        } else {
          const newSalesIndex = v.findIndex(
            (item) => item.listingResourceId === playerSales[0]
          );
          const newSales = v.slice(0, newSalesIndex);
          setPlayerSales(newSales.concat(playerSales));
        }

        setUpdatingSales(false);
      },
      handleError: (e) => {
        console.log(e);
      },
      params: {},
    });
  };

  const getPlayerListingData = () => {
    setUpdatingListings(true);

    getPlayerListings({
      handleSuccess: (v) => {
        if (playerListings === null || playerListings.length === 0) {
          setPlayerListings(v);
        } else {
          const newListingIndex = v.findIndex(
            (item) => item.listingResourceId === playerListings[0]
          );
          const newListings = v.slice(0, newListingIndex);
          setPlayerListings(newListings.concat(playerListings));
        }

        setUpdatingListings(false);
      },
      handleError: (e) => {
        console.log(e);
      },
      params: {},
    });
  };

  useEffect(() => {
    getPlayerSalesData();
    getPlayerListingData();

    const interval = setInterval(() => {
      getPlayerSalesData();
      getPlayerListingData();
    }, 30 * 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="BoxMflActivity">
      <h4>
        <i className="bi bi-activity me-1"></i>MFL Activity
        <div class="live-dot"></div>
      </h4>
      <div className="d-flex flex-column flex-fill">
        <div className="d-flex flex-column flex-grow-1 mb-1">
          <div>
            Latest listings{" "}
            {updatingListings && <span className="small">updating...</span>}
          </div>

          <div className="d-flex flex-row">
            {playerListings ? (
              <MiscHorizontalScroll
                content={
                  <div className="d-flex flex-row">
                    {playerListings.map((o) => (
                      <div>
                        <ItemCardSale key={o.listingResourceId} s={o} />
                      </div>
                    ))}
                  </div>
                }
              />
            ) : (
              <div className="w-100" style={{ height: "95px" }}>
                <LoadingSquare />
              </div>
            )}
          </div>
        </div>
        <div className="d-flex flex-column flex-grow-1">
          <div>
            Latest sales{" "}
            {updatingSales && <span className="small">updating...</span>}
          </div>
          <div className="d-flex flex-row">
            {" "}
            {playerSales ? (
              <MiscHorizontalScroll
                content={
                  <div className="d-flex flex-row">
                    {playerSales.map((o) => (
                      <div>
                        <ItemCardSale s={o} />{" "}
                      </div>
                    ))}{" "}
                  </div>
                }
              />
            ) : (
              <div className="w-100" style={{ height: "95px" }}>
                {" "}
                <LoadingSquare />
              </div>
            )}{" "}
          </div>{" "}
        </div>{" "}
      </div>{" "}
    </div>
  );
};

export default BoxMflActivity;
