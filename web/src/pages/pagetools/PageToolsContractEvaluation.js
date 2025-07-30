import BoxCard from "components/box/BoxCard.js";
import BoxMessage from "components/box/BoxMessage.js";
import ChartScatterPlayerContracts from "components/charts/ChartScatterPlayerContracts.js";
import ItemRowContract from "components/items/ItemRowContract.js";
import LoadingSquare from "components/loading/LoadingSquare.js";
import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { getContracts } from "services/api-assistant.js";
import { copyTextToClipboard } from "utils/clipboard.js";
import { positions, scarcity } from "utils/player.js";
import { convertDictToUrlParams } from "utils/url.js";

interface PageToolsContractEvaluationProps {}

const PageToolsContractEvaluation: React.FC<PageToolsContractEvaluationProps> = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);

  const [overall, setOverall] = useState(searchParams.get("overall") ? parseInt(searchParams.get("overall")) : null);
  const [position, setPosition] = useState(searchParams.get("position") ? searchParams.get("position") : null);
  const [firstPositionOnly, setFirstPositionOnly] = useState(
    searchParams.get("firstPositionOnly") ? searchParams.get("firstPositionOnly") === "true" : false
  );

  const [contracts, setContracts] = useState(null);
  const [hideZeros, setHideZeros] = useState(true);

  const getData = () => {
    setIsLoading(true);
    setContracts(null);

    navigate({
      search:
        "?" +
        convertDictToUrlParams({
          overall,
          position,
          firstPositionOnly,
        }),
    });

    getContracts({
      handleSuccess: (v) => {
        setIsLoading(false);
        setContracts(v.data.getContracts);
      },
      params: {
        minOvr: scarcity.map((s) => s.overallMin).indexOf(overall) < 0 ? overall - 1 : overall,
        maxOvr: scarcity.map((s) => s.overallMax).indexOf(overall) < 0 ? overall + 1 : overall,
        positions: [position],
        firstPositionOnly,
      },
    });
  };

  useEffect(() => {
    if (overall && position) {
      getData();
    }
  }, []);

  return (
    <div id="PageToolsContractEvaluation" className="h-100 w-100">
      <div className="container-xl h-100 px-2 px-md-4 py-4">
        <div className="d-flex flex-column flex-md-row h-100 w-100">
          <div className="d-flex flex-column flex-md-grow-0 flex-md-basis-300">
            <BoxCard
              title={"Contract details"}
              actions={
                contracts && (
                  <div className="flex-glow-0">
                    <button
                      className="btn btn-sm btn-link align-self-start"
                      onClick={() => copyTextToClipboard(window.location.href)}
                    >
                      <i className="bi bi-share-fill" />
                    </button>
                  </div>
                )
              }
              content={
                <div className="d-flex flex-fill flex-column">
                  <input
                    type="number"
                    min="30"
                    max="100"
                    step="1"
                    className="form-control w-100 mb-1"
                    value={overall}
                    onChange={(v) => {
                      setOverall(parseInt(v.target.value));
                    }}
                    placeholder={"OVR"}
                    autoFocus
                  />
                  <select
                    className="form-select w-100 mb-1"
                    value={position}
                    onChange={(v) => setPosition(v.target.value)}
                    placeholder={"Position*"}
                  >
                    <option value={""} key={null} />
                    {positions.map((p) => (
                      <option value={p.name} key={p.name}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                  <div className="d-flex flex-fill justify-content-end align-items-end mb-1">
                    <small>
                      First position only
                      <input
                        type="checkbox"
                        className="ms-1"
                        checked={firstPositionOnly}
                        onChange={(p) => setFirstPositionOnly(!firstPositionOnly)}
                      />
                    </small>
                  </div>
                  <button
                    className="btn btn-info text-white align-self-end"
                    onClick={() => getData()}
                    disabled={!overall || !position}
                  >
                    Evaluate
                  </button>
                </div>
              }
            />
          </div>

          <div className="d-flex flex-column flex-md-column flex-md-grow-1">
            <BoxCard
              className="flex-column flex-md-grow-1 flex-md-shrink-1 flex-md-basis-auto flex-basis-0"
              title={"Distribution per division"}
              actions={
                <small>
                  Hide zero rates
                  <input
                    type="checkbox"
                    className="ms-1"
                    checked={hideZeros}
                    onChange={() => setHideZeros(!hideZeros)}
                  />
                </small>
              }
              content={
                <div className="d-flex flex-fill overflow-hidden ratio-sm ratio-sm-4x3">
                  {!contracts && !isLoading ? (
                    <BoxMessage content="No selection" />
                  ) : (
                    <ChartScatterPlayerContracts contracts={contracts} hideZeros={hideZeros} />
                  )}
                </div>
              }
            />

            <BoxCard
              className="flex-column flex-md-grow-1 flex-md-shrink-1 flex-md-basis-auto flex-basis-0 max-height-md-300"
              title={"Contract list"}
              contentClassName={"overflow-auto"}
              content={
                <div className="d-flex flex-fill flex-column overflow-auto">
                  {!contracts && !isLoading && <BoxMessage content="No selection" />}

                  {isLoading && <LoadingSquare />}

                  {contracts &&
                    !isLoading &&
                    contracts.filter((c) => !hideZeros || c.revenueShare > 0).map((c) => <ItemRowContract c={c} />)}
                </div>
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PageToolsContractEvaluation;
