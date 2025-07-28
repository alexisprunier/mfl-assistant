import BoxSoonToCome from "components/box/BoxSoonToCome.js";
import ChartBarKeyCount from "components/charts/ChartBarKeyCount.js";
import ChartBarPlayerAttributeDistribution from "components/charts/ChartBarPlayerAttributeDistribution.js";
import ControllerPlayerCriteria from "components/controllers/ControllerPlayerCriteria.js";
import PopupPlayers from "components/popups/PopupPlayers.js";
import BoxCard from "components/box/BoxCard.js";
import Count from "components/counts/Count.js";
import FilterContainerPlayer from "components/filters/FilterContainerPlayer.js";
import React, { useEffect, useState, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { getPlayerDashboardData } from "services/api-assistant.js";

interface PageDashPlayersProps {}

const PageDashPlayers: React.FC<PageDashPlayersProps> = () => {
  const [searchParams] = useSearchParams();

  const [data, setData] = useState(null);
  const [selectedCriteria, setSelectedCriteria] = useState("OVR");
  const [filters, setFilters] = useState({
    firstPositionOnly: false,
    positions: searchParams.get("positions") ? searchParams.get("positions").split(",") : [],
    minAge: searchParams.get("minAge") ? parseInt(searchParams.get("minAge")) : undefined,
    maxAge: searchParams.get("maxAge") ? parseInt(searchParams.get("maxAge")) : undefined,
    minOvr: searchParams.get("minOvr") ? parseInt(searchParams.get("minOvr")) : undefined,
    maxOvr: searchParams.get("maxOvr") ? parseInt(searchParams.get("maxOvr")) : undefined,
  });

  const [selectedBar, setSelectedBar] = useState(null);

  const triggerRef = useRef(null);

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
        const values = data[key].map((item) => parseInt(item.key, 10)).sort((a, b) => a - b);

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

  const handleBarClick = (clickedItem) => {
    console.log(clickedItem);
    setSelectedBar(clickedItem);

    setTimeout(() => {
      triggerRef.current?.click();
    }, 0);
  };

  const buildFilters = () => {
    if (selectedBar) {
      if (selectedCriteria === "OVR") {
        return {
          ...filters,
          minOvr: parseInt(selectedBar.key),
          maxOvr: parseInt(selectedBar.key),
        };
      } else if (selectedCriteria === "AGE") {
        return {
          ...filters,
          minAge: parseInt(selectedBar.key),
          maxAge: parseInt(selectedBar.key),
        };
      } else if (selectedCriteria === "POS") {
        return {
          ...filters,
          positions: [selectedBar.key],
        };
      }
    }

    return { ...filters };
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
      <PopupPlayers
        open={selectedBar != null}
        onClose={() => setSelectedBar(null)}
        trigger={<button ref={triggerRef} style={{ display: "none" }} />}
        filters={buildFilters()}
      />

      <div className="container container-xl w-100 px-2 px-md-4 py-4">
        <div className="d-flex flex-column w-100">
          <div className="d-flex flex-row flex-grow-0 flex-basis-0 justify-content-end pb-2 pe-2">
            {Object.keys(filters).filter((k) => (Array.isArray(filters[k]) ? filters[k].length > 0 : filters[k]))
              .length > 0 && (
              <button
                className="btn btn-warning text-white align-self-end me-2"
                onClick={() => setFilters({ positions: [], forceFetch: true })}
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

          <div className="d-flex flex-column flex-md-row">
            <div className="d-flex flex-column flex-md-basis-300">
              <BoxCard content={<Count label="Players" count={data ? data.getPlayerCount : null} />} />

              <BoxCard content={<Count label="Owners" count={data ? data.getPlayerOwnerCount : null} />} />
            </div>

            <BoxCard
              className="d-flex flex-fill"
              title={"Players per criteria"}
              actions={
                <ControllerPlayerCriteria
                  selectedCriteria={selectedCriteria}
                  onChange={(c) => setSelectedCriteria(c)}
                />
              }
              content={
                <div className="d-flex flex-fill overflow-hidden ratio ratio-21x9">
                  <ChartBarKeyCount
                    data={data && data[selectedCriteria]}
                    onBarClick={(clickedItem) => {
                      handleBarClick(clickedItem);
                    }}
                  />
                </div>
              }
            />
          </div>

          <div className="d-flex flex-column flex-md-row flex-md-grow-1">
            <BoxCard
              className="d-flex flex-fill"
              title={"Attribute distribution"}
              content={
                <div className="d-flex flex-fill overflow-hidden ratio ratio-21x9">
                  <ChartBarPlayerAttributeDistribution data={computePlayerDistribution()} />
                </div>
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PageDashPlayers;
