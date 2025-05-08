import React, { useEffect, useState } from "react";
import {
  getFormationMetaEngines,
  getFormationMetas,
} from "services/api-assistant.js";
import BoxCard from "components/box/BoxCard.js";
import LoadingSquare from "components/loading/LoadingSquare.js";
import PopupFormationInfo from "components/popups/PopupFormationInfo.js";
import "./PageFormationMeta.css";

interface PageFormationMetaProps {}

const PageFormationMeta: React.FC<PageFormationMetaProps> = (props) => {
  const [engines, setEngines] = useState(null);
  const [selectedEngine, setSelectedEngine] = useState(null);
  const [formationMetas, setFormationMetas] = useState(null);
  const [formations, setFormations] = useState(null);
  const [dataMap, setDataMap] = useState(null);
  const [totalMatches, setTotalMatches] = useState(null);

  const fetchFormationMetaEngines = () => {
    getFormationMetaEngines({
      handleSuccess: (d) => {
        setEngines(d.data.getFormationMetaEngines.sort());
      },
      handleError: (e) => console.log(e),
    });
  };

  const fetchFormationMetas = () => {
    getFormationMetas({
      handleSuccess: (d) => {
        setFormationMetas(d.data.getFormationMetas);

        const set = new Set();
        d.data.getFormationMetas.forEach((item) => {
          set.add(item.formation1);
          set.add(item.formation2);
        });
        setFormations(Array.from(set).sort());

        const victoriesMap = {};
        d.data.getFormationMetas.forEach(
          ({ formation1, formation2, victories, draws, defeats, engine }) => {
            victoriesMap[`${formation1}||${formation2}`] = {
              formation1,
              formation2,
              victories,
              draws,
              defeats,
              engine,
            };
          }
        );
        setDataMap(victoriesMap);

        setTotalMatches(
          d.data.getFormationMetas
            .map((m) => m.victories + m.draws + m.defeats)
            .reduce((sum, val) => sum + val, 0) / 2
        );
      },
      handleError: (e) => console.log(e),
      params: { engine: selectedEngine },
    });
  };

  const shortenFormationName = (n) => {
    return n.replace(/([a-zA-Z])[a-zA-Z]*/g, "$1");
  };

  useEffect(() => {
    fetchFormationMetaEngines();
  }, []);

  useEffect(() => {
    setFormationMetas(null);
    setDataMap(null);
    setTotalMatches(null);
    fetchFormationMetas();
  }, [selectedEngine]);

  return (
    <div id="PageFormationMeta" className="d-flex flex-column w-100 h-100">
      <nav className="d-flex flex-grow-0 TopBar navbar w-100 ps-md-5 px-4 py-2">
        <h3 className="my-2">
          <i className="bi bi-grid-3x3-gap-fill me-2"></i> Formation meta
        </h3>
        <span class="text-warning">
          <i class="bi bi-cone-striped me-1"></i>ALPHA
        </span>
      </nav>

      <div className="d-flex flex-grow-1 flex-column container-xl px-2 px-md-4 py-4">
        <div className="d-flex" style={{ minHeight: "90px" }}>
          <BoxCard
            className="flex-fill pt-3"
            content={
              <>
                {engines ? (
                  <div className="d-flex flex-fill flex-column flex-lg-row">
                    <div className="d-flex flex-grow-0">
                      <select
                        className="form-control w-100 text-white"
                        value={selectedEngine}
                        onChange={(v) => setSelectedEngine(v.target.value)}
                      >
                        <option value={""} key={null} />
                        {engines.map((p) => (
                          <option value={p.toString()} key={p.toString()}>
                            {p}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="d-flex flex-grow-1 justify-content-end align-items-center">
                      <i class="bi bi-info-circle-fill me-1"></i>
                      Max OVR difference: 20
                    </div>
                  </div>
                ) : (
                  <LoadingSquare />
                )}
              </>
            }
          />
        </div>

        {selectedEngine && (
          <div
            className="d-flex flex-fill overflow-auto"
            style={{ height: "1px" }}
          >
            <BoxCard
              className="formation-box flex-fill overflow-auto p-0 pb-0 pt-0 pe-0 ps-0 py-0 px-0"
              content={
                formationMetas && formations && dataMap ? (
                  <div
                    className="d-flex flex-column flex-fill"
                    style={{ minHeight: 0 }}
                  >
                    <table
                      className="formation-table"
                      cellPadding="5"
                      style={{
                        borderCollapse: "collapse",
                        width: "100%",
                      }}
                    >
                      <thead>
                        <tr>
                          <th
                            className="sticky top-left"
                            style={{ minWidth: "120px" }}
                          >
                            {totalMatches && (
                              <>
                                <div>{totalMatches}</div>
                                <div>Matches</div>
                              </>
                            )}
                          </th>
                          {formations.map((formation2) => (
                            <th className="sticky top" key={formation2}>
                              {shortenFormationName(formation2)}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {formations.map((formation1) => (
                          <tr key={formation1}>
                            <th
                              className="sticky left"
                              style={{ minWidth: "120px" }}
                            >
                              {shortenFormationName(formation1)}
                            </th>
                            {formations.map((formation2) => {
                              const key = `${formation1}||${formation2}`;
                              const victories =
                                dataMap[key] &&
                                dataMap[key].victories &&
                                dataMap[key].draws &&
                                dataMap[key].defeats
                                  ? Math.round(
                                      (dataMap[key].victories /
                                        (dataMap[key].victories +
                                          dataMap[key].draws +
                                          dataMap[key].defeats)) *
                                        100
                                    )
                                  : "";
                              const matches =
                                dataMap[key] &&
                                dataMap[key].victories &&
                                dataMap[key].draws &&
                                dataMap[key].defeats
                                  ? dataMap[key].victories +
                                    dataMap[key].draws +
                                    dataMap[key].defeats
                                  : "";
                              return (
                                <td
                                  className="position-relative"
                                  key={key}
                                  style={
                                    formation1 === formation2
                                      ? {
                                          backgroundColor:
                                            "rgba(255, 255, 255, 0.10)",
                                        }
                                      : {
                                          backgroundColor: `rgba(248, 98, 133, ${
                                            victories ? victories / 400 : 0
                                          })`,
                                        }
                                  }
                                >
                                  <PopupFormationInfo
                                    trigger={
                                      <div>
                                        {victories}
                                        {victories && "%"}
                                        <div
                                          className="position-absolute"
                                          style={{
                                            right: "2px",
                                            bottom: "-2px",
                                            fontSize: "10px",
                                            color: "rgba(255, 255, 255, 0.3)",
                                          }}
                                        >
                                          {matches}
                                        </div>
                                      </div>
                                    }
                                    onClose={() => console.log("closed")}
                                    data={dataMap[key]}
                                  />
                                </td>
                              );
                            })}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="w-100 h-100">
                    <LoadingSquare />
                  </div>
                )
              }
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default PageFormationMeta;
