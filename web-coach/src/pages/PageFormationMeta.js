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
  const [globalDataMap, setGlobalDataMap] = useState(null);
  const [totalMatches, setTotalMatches] = useState(null);
  const [displays, setDisplays] = useState([
    "Victory rate",
    "Victory and draw rate",
    "Point average",
  ]);
  const [selectedDisplay, setSelectedDisplay] = useState("Victory rate");
  const [detailedView, setDetailedView] = useState(true);

  const fetchFormationMetaEngines = () => {
    getFormationMetaEngines({
      handleSuccess: (d) => {
        const orderedEngines = d.data.getFormationMetaEngines.sort((a, b) => {
          const parse = (v) => {
            const [main] = v.split("/");
            const [maj, min, rest] = main.split(".");
            const [patch, beta] = rest.split("-beta.");
            return {
              major: +maj,
              minor: +min,
              patch: +patch,
              isBeta: rest.includes("beta"),
              betaNum: beta ? +beta : Infinity,
            };
          };
          const va = parse(a),
            vb = parse(b);

          return (
            vb.major - va.major ||
            vb.minor - va.minor ||
            vb.patch - va.patch ||
            (va.isBeta !== vb.isBeta
              ? va.isBeta
                ? 1
                : -1
              : vb.betaNum - va.betaNum)
          );
        });

        setEngines(orderedEngines);
        setSelectedEngine(
          orderedEngines.filter((e) => !e.includes("beta"))[0] ?? null
        );
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

        const dataMap = {};
        d.data.getFormationMetas.forEach(
          ({ formation1, formation2, victories, draws, defeats, engine }) => {
            dataMap[`${formation1}||${formation2}`] = {
              formation1,
              formation2,
              victories,
              draws,
              defeats,
              engine,
            };
          }
        );
        setDataMap(dataMap);

        const globalDataMap = {};
        d.data.getFormationMetas.forEach(
          ({ formation1, victories, draws, defeats, engine }) => {
            if (!globalDataMap[formation1]) {
              globalDataMap[formation1] = {
                formation1,
                formation2: null,
                victories: 0,
                draws: 0,
                defeats: 0,
                engine: engine,
              };
            }

            globalDataMap[formation1].victories += victories;
            globalDataMap[formation1].draws += draws;
            globalDataMap[formation1].defeats += defeats;
          }
        );
        setGlobalDataMap(globalDataMap);

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

  const getDetailCellValue = (data) => {
    let output = "";
    if (data && data.victories && data.draws && data.defeats) {
      if (selectedDisplay === "Victory rate") {
        output = Math.round(
          (data.victories / (data.victories + data.draws + data.defeats)) * 100
        );
      } else if (selectedDisplay === "Victory and draw rate") {
        output = Math.round(
          ((data.victories + data.draws) /
            (data.victories + data.draws + data.defeats)) *
            100
        );
      } else if (selectedDisplay === "Point average") {
        output =
          Math.round(
            (100 * (data.victories * 3 + data.draws)) /
              (data.victories + data.draws + data.defeats)
          ) / 100;
      }
    }

    return output;
  };

  const countMatches = (data) => {
    return data && data.victories && data.draws && data.defeats
      ? data.victories + data.draws + data.defeats
      : "";
  };

  const buildCell = (data, formation1, formation2, overridenValue = null) => {
    const value = overridenValue || getDetailCellValue(data);
    const matchCount = countMatches(data);
    console.log(data, formation1, formation2);

    return (
      <td
        className="position-relative"
        key={formation1 || formation2}
        style={
          formation1 === formation2
            ? {
                backgroundColor: "rgba(255, 255, 255, 0.10)",
              }
            : {
                backgroundColor: `rgba(248, 98, 133, ${
                  value
                    ? !detailedView || selectedDisplay.includes("rate")
                      ? value / 100 / 4
                      : value / 3 / 4
                    : 0
                })`,
              }
        }
      >
        <PopupFormationInfo
          trigger={
            <div>
              {overridenValue ? value + "%" : value}
              {value &&
                !overridenValue &&
                selectedDisplay.includes("rate") &&
                "%"}
              <div
                className="position-absolute"
                style={{
                  right: "2px",
                  bottom: "-2px",
                  fontSize: "10px",
                  color: "rgba(255, 255, 255, 0.3)",
                }}
              >
                {matchCount}
              </div>
            </div>
          }
          onClose={() => console.log("closed")}
          data={data}
        />
      </td>
    );
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
      <nav className="d-flex flex-grow-0 TopBar navbar w-100 px-4 py-2">
        <h3 className="my-2 ps-5">
          <i className="bi bi-grid-3x3-gap-fill me-2"></i> Formation meta
        </h3>
      </nav>

      <div className="d-flex flex-grow-1 flex-column container-xl px-2 px-md-4 py-4">
        <div className="d-flex" style={{ minHeight: "90px" }}>
          <BoxCard
            className="flex-fill pt-3"
            content={
              <>
                {engines ? (
                  <div className="d-flex flex-fill flex-column flex-lg-row">
                    <div className="d-flex flex-grow-0 flex-column flex-sm-row">
                      <select
                        className="form-control w-100 text-white me-0 me-sm-1"
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
                      <select
                        className="form-control w-100 text-white me-0 me-sm-1"
                        value={selectedDisplay}
                        onChange={(v) => setSelectedDisplay(v.target.value)}
                      >
                        {displays.map((p) => (
                          <option value={p} key={p}>
                            {p}
                          </option>
                        ))}
                      </select>
                      <small>
                        <div className="d-flex flex-row h-100 align-items-center mt-1 mt-sm-0 mx-1">
                          <input
                            type="checkbox"
                            className="me-1"
                            checked={detailedView}
                            onChange={(p) => setDetailedView(!detailedView)}
                          />
                          Detailed
                        </div>
                      </small>
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
                          {detailedView ? (
                            <>
                              {formations.map((formation2) => (
                                <th className="sticky top" key={formation2}>
                                  {shortenFormationName(formation2)}
                                </th>
                              ))}
                            </>
                          ) : (
                            <>
                              <th className="sticky top">Victory</th>
                              <th className="sticky top">Draw</th>
                              <th className="sticky top">Defeat</th>
                            </>
                          )}
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
                            {detailedView ? (
                              <>
                                {formations.map((formation2) => {
                                  const key = `${formation1}||${formation2}`;
                                  return buildCell(
                                    dataMap[key],
                                    formation1,
                                    formation2
                                  );
                                })}
                              </>
                            ) : (
                              <>
                                {buildCell(
                                  globalDataMap[formation1],
                                  formation1,
                                  null,
                                  Math.round(
                                    (globalDataMap[formation1].victories /
                                      (globalDataMap[formation1].victories +
                                        globalDataMap[formation1].draws +
                                        globalDataMap[formation1].defeats)) *
                                      100
                                  )
                                )}
                                {buildCell(
                                  globalDataMap[formation1],
                                  formation1,
                                  null,
                                  Math.round(
                                    (globalDataMap[formation1].draws /
                                      (globalDataMap[formation1].victories +
                                        globalDataMap[formation1].draws +
                                        globalDataMap[formation1].defeats)) *
                                      100
                                  )
                                )}
                                {buildCell(
                                  globalDataMap[formation1],
                                  formation1,
                                  null,
                                  Math.round(
                                    (globalDataMap[formation1].defeats /
                                      (globalDataMap[formation1].victories +
                                        globalDataMap[formation1].draws +
                                        globalDataMap[formation1].defeats)) *
                                      100
                                  )
                                )}
                              </>
                            )}
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
