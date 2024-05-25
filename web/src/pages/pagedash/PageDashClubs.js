import React, { useState, useEffect } from 'react';
import Count from "components/counts/Count.js";
import BoxClubMap from "components/box/BoxClubMap.js";
import { getClubData } from "services/api-assistant.js";
import ChartBarClubsPerDivision from "components/charts/ChartBarClubsPerDivision.js";
import ChartBarClubsPerOwner from "components/charts/ChartBarClubsPerOwner.js";

interface PageDashClubsProps {}

const PageDashClubs: React.FC < PageDashClubsProps > = ({}) => {
    const [isLoading, setIsLoading] = useState(false);
    const [clubData, setClubData] = useState(null);
    const [foundedClubOnly, setFoundedClubOnly] = useState(false);

    const getData = (pursue, beforeListingId) => {
      setIsLoading(true);

      getClubData({
        handleSuccess: (v) => {
          setClubData(v.data)
          setIsLoading(false);
        },
      });
    }

    useEffect(() => {
      getData();
    }, []);

    return (
        <div id="PageDashClubs" className="h-100 w-100">
        <div className="container container-xl h-100 w-100 px-2 px-md-4 py-4">
          <div className="d-flex flex-column h-100 w-100 fade-in">
            <div className="d-flex flex-column flex-md-row flex-md-grow-0 flex-basis-300">
              <div className="card d-flex flex-column flex-md-grow-0 flex-basis-300 m-2 p-3 pt-2">
                <div className="d-flex flex-row flex-md-grow-1">
                  <div className="d-flex flex-column flex-grow-1 flex-basis-0 align-items-center justify-content-center py-4 py-md-0">
                    <Count
                      label="Clubs"
                      count={clubData?.getAllClubCount}
                    />
                  </div>
                  <div className="d-flex flex-column flex-grow-1 flex-basis-0 align-items-center justify-content-center py-4 py-md-0">
                    <Count
                      label="Est. clubs"
                      count={clubData?.getClubCount}
                    />
                  </div>
                </div>
                <div className="d-flex flex-row flex-md-grow-1">
                  <div className="d-flex flex-column flex-grow-1 flex-basis-0 align-items-center justify-content-center py-4 py-md-0">
                    <Count
                      label="Owners"
                      count={clubData?.getClubOwnerCount}
                    />
                  </div>
                  <div className="d-flex flex-column flex-grow-1 flex-basis-0 align-items-center justify-content-center py-4 py-md-0">
                    <Count
                      label="AVR/owner"
                      count={clubData?.getClubOwnerCount && clubData?.getAllClubCount
                        ? (clubData?.getAllClubCount / clubData?.getClubOwnerCount).toFixed(2)
                        : undefined
                      }
                    />
                  </div>
                </div>
              </div>

              <div className="card d-flex flex-column flex-md-grow-1 m-2 p-3 pt-2 max-height-md-300">
                <div className="d-flex flex-row mb-2">
                  <div className="d-flex flex-row mb-2">
                    <h4 className="flex-grow-1">Established clubs</h4>
                  </div>
                </div>

                <div className="d-flex flex-fill overflow-hidden">
                  
                </div>
              </div>
            </div>

            <div className="d-flex flex-column flex-md-row flex-md-grow-1">
              <div className="card d-flex flex-column flex-md-grow-1 m-2 p-3 pt-2">
                <div className="d-flex flex-row mb-2">
                  <div className="d-flex flex-row mb-2">
                    <h4 className="flex-grow-1">Clubs per owner</h4>
                  </div>

                  <div className="d-flex flex-fill overflow-auto justify-content-end align-items-end">
                    <small>
                      Est. club only
                      <input
                        type="checkbox"
                        className="ms-1"
                        value={foundedClubOnly}
                        onChange={() => setFoundedClubOnly(!foundedClubOnly)}
                      />
                    </small>
                  </div>
                </div>

                <div className="d-flex flex-fill overflow-hidden">
                  <ChartBarClubsPerOwner
                    data={foundedClubOnly
                      ? clubData?.getClubsPerOwnerCounts
                      : clubData?.getAllClubsPerOwnerCounts
                    }
                  />
                </div>
              </div>

              <div className="card d-flex flex-column flex-md-grow-1 m-2 p-3 pt-2">
                <div className="d-flex flex-row mb-2">
                  <div className="d-flex flex-row mb-2">
                    <h4 className="flex-grow-1">Clubs per division</h4>
                  </div>

                  <div className="d-flex flex-fill overflow-auto justify-content-end align-items-end">
                    <small>
                      Est. club only
                      <input
                        type="checkbox"
                        className="ms-1"
                        value={foundedClubOnly}
                        onChange={() => setFoundedClubOnly(!foundedClubOnly)}
                      />
                    </small>
                  </div>
                </div>

                <div className="d-flex flex-fill overflow-hidden">
                  <ChartBarClubsPerDivision
                    data={foundedClubOnly
                      ? clubData?.getClubDivisionCounts
                      : clubData?.getAllClubDivisionCounts
                    }
                  />
                </div>
              </div>
            </div>
          </div>
      </div> <
    /div>
  );
};

export default PageDashClubs;