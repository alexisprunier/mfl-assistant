import React, { useState, useEffect } from "react";
import Count from "components/counts/Count.js";
import { getClubData } from "services/api-assistant.js";
import ChartBarClubsPerDivision from "components/charts/ChartBarClubsPerDivision.js";
import ChartBarClubsPerOwner from "components/charts/ChartBarClubsPerOwner.js";
import ChartAreaClubsPerDay from "components/charts/ChartAreaClubsPerDay.js";
import BoxCard from "components/box/BoxCard.js";

interface PageDashClubsProps {}

const PageDashClubs: React.FC<PageDashClubsProps> = ({}) => {
  const [clubData, setClubData] = useState(null);
  const [foundedClubOnlyForOwners, setFoundedClubOnlyForOwners] = useState(false);
  const [foundedClubOnlyForDivisions, setFoundedClubOnlyForDivisions] = useState(false);

  const getData = (pursue, beforeListingId) => {
    getClubData({
      handleSuccess: (v) => {
        setClubData(v.data);
      },
    });
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <div id="PageDashClubs" className="h-100 w-100">
      <div className="container container-xl w-100 px-2 px-md-4 py-4">
        <div className="d-flex flex-column w-100">
          <div className="d-flex flex-column flex-md-row flex-md-grow-0 flex-md-basis-300">
            <div className="d-flex flex-column flex-md-basis-300">
              <BoxCard content={<Count label="Clubs" count={clubData?.getAllClubCount} />} />
              <BoxCard content={<Count label="Established clubs" count={clubData?.getClubCount} />} />
              <BoxCard
                content={
                  <Count
                    label="Average per user"
                    count={
                      clubData?.getClubOwnerCount && clubData?.getAllClubCount
                        ? (clubData?.getAllClubCount / clubData?.getClubOwnerCount).toFixed(2)
                        : undefined
                    }
                  />
                }
              />
            </div>

            <BoxCard
              className="d-flex flex-fill"
              title={"Clubs per owner"}
              actions={
                <small>
                  Established club only
                  <input
                    type="checkbox"
                    className="ms-1"
                    value={foundedClubOnlyForOwners}
                    onChange={() => setFoundedClubOnlyForOwners(!foundedClubOnlyForOwners)}
                  />
                </small>
              }
              content={
                <div className="d-flex flex-fill overflow-hidden ratio ratio-16x9">
                  <ChartBarClubsPerOwner
                    data={
                      foundedClubOnlyForOwners ? clubData?.getClubsPerOwnerCounts : clubData?.getAllClubsPerOwnerCounts
                    }
                  />
                </div>
              }
            />
          </div>

          <div className="d-flex flex-column flex-md-row flex-md-grow-1">
            <BoxCard
              className="d-flex flex-md-basis-50p"
              title={"Established clubs"}
              content={
                <div className="d-flex flex-fill ratio ratio-4x3">
                  <ChartAreaClubsPerDay data={clubData?.getDataPoints} />
                </div>
              }
            />

            <BoxCard
              className="d-flex flex-md-basis-50p"
              title={"Clubs per division"}
              actions={
                <small>
                  Established club only
                  <input
                    type="checkbox"
                    className="ms-1 mt-1"
                    value={foundedClubOnlyForDivisions}
                    onChange={() => setFoundedClubOnlyForDivisions(!foundedClubOnlyForDivisions)}
                  />
                </small>
              }
              content={
                <div className="d-flex flex-fill ratio ratio-4x3">
                  <ChartBarClubsPerDivision
                    data={
                      foundedClubOnlyForDivisions ? clubData?.getClubDivisionCounts : clubData?.getAllClubDivisionCounts
                    }
                  />
                </div>
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PageDashClubs;
