import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { NotificationManager as nm } from "react-notifications";
import FilterContainerPlayer from "components/filters/FilterContainerPlayer.js";
import BoxWarning from "components/box/BoxWarning.js";
import { getContracts } from "services/api-assistant.js";
import BoxSoonToCome from "components/box/BoxSoonToCome.js";
import BoxMessage from "components/box/BoxMessage.js";
import Count from "components/counts/Count.js";
import { positions, scarcity } from "utils/player.js";
import ChartScatterPlayerContracts from "components/charts/ChartScatterPlayerContracts.js";

interface PageToolsContractEvaluationProps {}

const PageToolsContractEvaluation: React.FC < PageToolsContractEvaluationProps > = () => {
  const [isLoading, setIsLoading] = useState(false);

  const [overall, setOverall] = useState(undefined);
  const [position, setPosition] = useState(undefined);
  const [rate, setRate] = useState(undefined);

  const [contracts, setContracts] = useState(null);
  const [hideZeros, setHideZeros] = useState(false);

  const getData = (pursue, beforeListingId) => {
    setIsLoading(true);
    setContracts(null);

    getContracts({
      handleSuccess: (v) => {
        setIsLoading(false);
        setContracts(v.data.getContracts);
      },
      params: {
        minOvr: scarcity.map((s) => s.overallMin).indexOf(overall) < 0 ? overall - 1 : overall,
        maxOvr: scarcity.map((s) => s.overallMax).indexOf(overall) < 0 ? overall + 1 : overall,
        positions: [position],
      }
    });
  }

  return (
    <div id="PageToolsContractEvaluation" className="h-100 w-100">
      <div className="container-xxl h-100 px-2 px-md-4 py-4">
        <div className="d-flex flex-column flex-md-row h-100 w-100 fade-in">
          <div className="d-flex flex-column flex-md-grow-0 flex-basis-300">
            <div className="card d-flex flex-column flex-md-grow-0 m-2 p-3 pt-2">
              <div className="d-flex flex-row flex-md-grow-1">
                <h4 className="flex-grow-1">Contract information</h4>
              </div>

              <div className="d-flex flex-fill flex-column">
                <input
                  type="number"
                  min="30"
                  max="100"
                  step="1"
                  className="form-control w-100 mb-1"
                  value={overall}
                  onChange={(v) => {setOverall(parseInt(v.target.value))}}
                  placeholder={"OVR*"}
                  autoFocus
                />
                <select
                  className="form-select w-100 mb-1"
                  value={position}
                  onChange={(v) => setPosition(v.target.value)}
                  placeholder={"Position*"}
                >
                  <option value={""} key={null}/>
                  {positions.map((p) => (
                    <option value={p.name} key={p.name}>
                      {p.name}
                    </option>
                  ))}
                </select>
                <input
                  type="number"
                  min="0"
                  max="100"
                  step="0.1"
                  className="form-control w-100 mb-1"
                  value={rate}
                  onChange={(v) => setRate(v.target.value)}
                  disabled={true}
                  placeholder={"Contract rate"}
                />
                <button
                  className="btn btn-info text-white align-self-end"
                  onClick={() => getData()}
                  disabled={!overall || !position}
                >
                  Evaluate
                </button>
              </div>
            </div>

            <div className="card d-flex flex-column flex-fill m-2 p-3 pt-2">
              <div className="d-flex flex-row">
                <div className="d-flex">
                  <h4 className="flex-grow-1">Advised rates</h4>
                </div>
              </div>

              <div className="d-flex flex-fill overflow-hidden">
                <BoxSoonToCome />
              </div>
            </div>
          </div>

          <div className="d-flex flex-column flex-md-column flex-md-grow-1">
            <div className="card d-flex flex-column flex-md-grow-1 flex-md-shrink-1 flex-md-basis-auto flex-basis-0 m-2 p-3 pt-2">
              <div className="d-flex flex-row">
                <div className="d-flex">
                  <h4 className="flex-grow-1">Similar players under contract</h4>
                </div>

                <div className="d-flex flex-fill overflow-auto justify-content-end align-items-end">
                  <small>
                    Hide zero rates
                    <input
                      type="checkbox"
                      className="ms-1"
                      value={hideZeros}
                      onChange={() => setHideZeros(!hideZeros)}
                    />
                  </small>
                </div>
              </div>

              <div className="d-flex flex-fill overflow-hidden">
                {!contracts && !isLoading
                  ? <BoxMessage content="No criteria selected"/>
                  : <ChartScatterPlayerContracts
                    contracts={contracts}
                    hideZeros={hideZeros}
                  />
                }
              </div>
            </div>

            <div className="card d-flex flex-column flex-md-grow-1 flex-md-shrink-1 flex - basis - 400 m-2 p-3 pt-2">
              <div className="d-flex flex-row">
                <div className="d-flex">
                  <h4 className="flex-grow-1">Contract details</h4>
                </div>
              </div>

              <div className="d-flex flex-fill overflow-hidden">
                <BoxSoonToCome />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PageToolsContractEvaluation;