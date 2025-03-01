import BoxSoonToCome from "components/box/BoxSoonToCome.js";
import ChartBarKeyCount from "components/charts/ChartBarKeyCount.js";
import ChartBarPlayerAttributeDistribution from "components/charts/ChartBarPlayerAttributeDistribution.js";
import ControllerPlayerCriteria from "components/controllers/ControllerPlayerCriteria.js";
import Count from "components/counts/Count.js";
import FilterContainerPlayer from "components/filters/FilterContainerPlayer.js";
import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { getPlayerDashboardData } from "services/api-assistant.js";

interface PageDashPlayersProps {}

const PageDashPlayers: React.FC<PageDashPlayersProps> = () => {
  const [searchParams] = useSearchParams();

  const [data, setData] = useState(null);
  const [selectedCriteria, setSelectedCriteria] = useState("OVR");
  const [filters, setFilters] = useState({
    positions: searchParams.get("positions")
      ? searchParams.get("positions").split(",")
      : [],
    minAge: searchParams.get("minAge")
      ? parseInt(searchParams.get("minAge"))
      : undefined,
    maxAge: searchParams.get("maxAge")
      ? parseInt(searchParams.get("maxAge"))
      : undefined,
    minOvr: searchParams.get("minOvr")
      ? parseInt(searchParams.get("minOvr"))
      : undefined,
    maxOvr: searchParams.get("maxOvr")
      ? parseInt(searchParams.get("maxOvr"))
      : undefined,
  });

  const fetchData = () => {
    setData(null);

    getPlayerDashboardData({
      handleSuccess: (v) => {
        setData(v.data);
      },
      params: {
        ...filters,
        forceFetch: undefined,
      },
    });
  };

  const computePlayerDistribution = () => {
    if (!data) {
      return null;
    }

    const keys = ["OVR", "PAC", "DRI", "PAS", "SHO", "DEF", "PHY"];

    const stats = {};

    keys.forEach((key) => {
      if (data[key]) {
        const values = data[key]
          .map((item) => parseInt(item.key, 10))
          .sort((a, b) => a - b);

        const min = values[0];
        const max = values[values.length - 1];
        const median = calculateMedian(values);

        stats[key] = { min, median, max };
      }
    });

    return stats;

    function calculateMedian(arr) {
      const len = arr.length;
      if (len % 2 === 0) {
        return (arr[len / 2 - 1] + arr[len / 2]) / 2;
      } else {
        return arr[Math.floor(len / 2)];
      }
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (filters.forceFetch) {
      fetchData();
      setFilters({ ...filters, forceFetch: undefined });
    }
  }, [filters]);

  return (
    <div id="PageDashPlayers" className="h-100 w-100">
      <div className="container container-xl h-100 w-100 px-2 px-md-4 py-4">
        <div className="d-flex flex-column h-100 w-100 fade-in">
          <div className="d-flex flex-column flex-md-row flex-md-grow-0 flex-md-basis-300">
            <div className="card d-flex flex-column flex-md-grow-0 flex-md-basis-300 m-2 p-3 pt-2">
              <div className="d-flex flex-column flex-md-grow-1">
                <div className="d-flex flex-row flex-grow-0 flex-basis-0 justify-content-end pb-4 py-md-0">
                  {Object.keys(filters).filter((k) =>
                    Array.isArray(filters[k])
                      ? filters[k].length > 0
                      : filters[k]
                  ).length > 0 && (
                    <button
                      className="btn btn-warning text-white align-self-end me-2"
                      onClick={() =>
                        setFilters({ positions: [], forceFetch: true })
                      }
                    >
                      <i className="bi bi-x-square-fill" />
                    </button>
                  )}

                  <FilterContainerPlayer
                    trigger={
                      <button className="btn btn-info text-white align-self-end">
                        <i className="bi bi-filter-square-fill" />
                        &nbsp;Filter players
                      </button>
                    }
                    filters={filters}
                    onChange={(f) => setFilters(f)}
                    onApply={() => fetchData()}
                    showPositions={true}
                    showOverallScore={true}
                    showAge={true}
                  />
                </div>

                <div className="d-flex flex-column flex-grow-1 flex-basis-0 align-items-center justify-content-center py-4 py-md-0">
                  <Count
                    label="Players"
                    count={data ? data.getPlayerCount : null}
                  />
                </div>
              </div>
            </div>

            <div className="card d-flex flex-column flex-md-grow-1 m-2 p-3 pt-2 max-height-md-300">
              <div className="d-flex flex-column flex-lg-row">
                <div className="d-flex">
                  <h4 className="flex-grow-1">Players per criteria</h4>
                </div>

                <div className="d-flex flex-fill overflow-auto justify-content-end align-items-end">
                  <ControllerPlayerCriteria
                    selectedCriteria={selectedCriteria}
                    onChange={(c) => setSelectedCriteria(c)}
                  />
                </div>
              </div>

              <div className="d-flex flex-fill overflow-hidden ratio-sm ratio-sm-4x3">
                <ChartBarKeyCount data={data && data[selectedCriteria]} />
              </div>
            </div>
          </div>

          <div className="d-flex flex-column flex-md-row flex-md-grow-1">
            <div className="card d-flex flex-md-grow-1 m-2 p-3 pt-2">
              <div className="d-flex flex-column flex-lg-row">
                <div className="d-flex">
                  <h4 className="flex-grow-1">Attribute distribution</h4>
                </div>
              </div>

              <div className="d-flex flex-fill overflow-hidden ratio-sm ratio-sm-4x3">
                <ChartBarPlayerAttributeDistribution
                  data={computePlayerDistribution()}
                />
              </div>
            </div>

            <div className="card d-flex flex-md-grow-1 flex-md-shrink-1 m-2 p-3 pt-2 flex-md-basis-300">
              <div className="d-flex flex-fill overflow-hidden ratio-sm ratio-sm-4x3">
                <BoxSoonToCome />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PageDashPlayers;
