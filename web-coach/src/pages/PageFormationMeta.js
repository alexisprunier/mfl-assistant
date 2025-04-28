import React, { useEffect, useState } from "react";
import {
  getFormationMetaEngines,
  getFormationMetas,
} from "services/api-assistant.js";
import BoxCard from "components/box/BoxCard.js";
import LoadingSquare from "components/loading/LoadingSquare.js";
import "./PageFormationMeta.css";

interface PageFormationMetaProps {}

const PageFormationMeta: React.FC<PageFormationMetaProps> = (props) => {
  const [engines, setEngines] = useState(null);
  const [selectedEngine, setSelectedEngine] = useState(null);
  const [formationMetas, setFormationMetas] = useState(null);
  const [formations, setFormations] = useState(null);
  const [dataMap, setDataMap] = useState(null);

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
          ({ formation1, formation2, victories, draws, defeats }) => {
            victoriesMap[`${formation1}||${formation2}`] = {
              victories,
              draws,
              defeats,
            };
          }
        );
        setDataMap(victoriesMap);
      },
      handleError: (e) => console.log(e),
      params: { engine: selectedEngine },
    });
  };

  const getFormations = () => {};

  useEffect(() => {
    fetchFormationMetaEngines();
  }, []);

  useEffect(() => {
    fetchFormationMetas();
  }, [selectedEngine]);

  return (
    <div id="PageFormationMeta" className="w-100 h-100">
      <nav className="TopBar navbar w-100 ps-md-5 px-4 py-2">
        <h3 className="my-2">
          <i className="bi bi-grid-3x3-gap-fill me-2"></i> Formation meta
        </h3>
      </nav>

      <div className="container-xl px-2 px-md-4 py-4">
        <div className="d-flex flex-column flex-fill">
          <div className="d-flex flex-fill" style={{ minHeight: "90px" }}>
            <BoxCard
              className="flex-fill pt-3"
              content={
                <>
                  {engines ? (
                    <div>
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
                  ) : (
                    <LoadingSquare />
                  )}
                </>
              }
            />
          </div>

          {selectedEngine && (
            <div className="d-flex flex-fill">
              <BoxCard
                className="flex-fill pt-3"
                content={
                  formationMetas && formations && dataMap ? (
                    <div className="table-container">
                      <table
                        className="formation-table"
                        cellPadding="5"
                        style={{ borderCollapse: "collapse", width: "100%" }}
                      >
                        <thead>
                          <tr>
                            <th className="sticky top-left"></th>
                            {formations.map((formation2) => (
                              <th className="sticky top" key={formation2}>
                                {formation2}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {formations.map((formation1) => (
                            <tr key={formation1}>
                              <th className="sticky left">{formation1}</th>
                              {formations.map((formation2) => {
                                const key = `${formation1}||${formation2}`;
                                console.log(key, dataMap[key]);
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
                                      ) + "%"
                                    : "";
                                return (
                                  <td
                                    key={key}
                                    style={
                                      formation1 === formation2
                                        ? { backgroundColor: "#808080" }
                                        : {}
                                    }
                                  >
                                    {victories}
                                  </td>
                                );
                              })}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="w-100" style={{ minHeight: "100px" }}>
                      <LoadingSquare />
                    </div>
                  )
                }
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PageFormationMeta;
