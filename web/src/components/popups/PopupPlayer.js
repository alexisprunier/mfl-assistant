import React, { useState, useEffect } from "react";
import Popup from "reactjs-popup";
import ButtonMflPlayerInfo from "components/buttons/ButtonMflPlayerInfo.js";
import ButtonMflPlayer from "components/buttons/ButtonMflPlayer.js";
import BoxCard from "components/box/BoxCard.js";
import { getPlayerPricingHistory } from "services/api-assistant.js";
import ChartLinePricingHistory from "components/charts/ChartLinePricingHistory.js";
import LoadingSquare from "components/loading/LoadingSquare.js";
import PopupInformationPricing from "components/popups/PopupInformationPricing.js";
import { useNavigate } from "react-router-dom";

import {
  positions,
  getCalculatedOverall,
  getOverallTag,
} from "utils/player.js";

interface PopupPlayerProps {
  className: String;
  player: Object;
  trigger: Object;
}

const PopupPlayer: React.FC<PopupPlayerProps> = ({
  className,
  player,
  trigger,
}) => {
  const navigate = useNavigate();

  const [pricings, setPricings] = useState(null);

  const fetchPlayerPricingHistory = () => {
    getPlayerPricingHistory({
      handleSuccess: (d) => {
        if (d.data.getPlayerPricingHistory) {
          setPricings(d.data.getPlayerPricingHistory);
        }
      },
      handleError: (e) => console.log(e),
      params: {
        overall: player.overall,
        age: player.age,
        position: player.positions[0],
      },
    });
  };

  const getOVRs = () => {
    return positions
      .map((pos) => {
        const calcOVR = getCalculatedOverall(player, pos.name);
        return {
          pos: pos.name,
          ovr: calcOVR,
          diff: calcOVR - player.overall,
        };
      })
      .filter((a) => a.ovr > 0)
      .sort((a, b) => b.ovr - a.ovr)
      .slice(0, 3);
  };

  const getDiff = (diff) => {
    if (diff === 0) {
      return;
    }

    if (diff > 0) {
      return <div className="d-inline-block text-info">+{diff}</div>;
    } else {
      return <div className="d-inline-block text-danger">{diff}</div>;
    }
  };

  return (
    <div className="PopupPlayer d-flex flex-fill">
      <Popup
        trigger={trigger}
        modal
        closeOnDocumentClick
        className={"fade-in popup-lg " + className}
        onOpen={fetchPlayerPricingHistory}
      >
        {(close) => (
          <div className="container bg-dark overflow-auto border border-info border-3 rounded-3 p-4">
            <div className="d-flex flex-row mb-3">
              <div className="flex-grow-1">
                <h2 className="text-white">
                  <i className="bi bi-person-badge-fill me-1" />
                  {player.firstName} {player.lastName}
                </h2>
              </div>
              <div className="flex-grow-0">
                <button className={"btn"} onClick={close}>
                  <i className="bi bi-x-lg"></i>
                </button>
              </div>
            </div>

            <div className="d-flex flex-column flex-md-row m-1 mb-3">
              <div className="d-flex flex-column flex-md-basis-200">
                <div className="d-flex justify-content-center mb-3">
                  <img
                    src={`https://d13e14gtps4iwl.cloudfront.net/players/${player.id}/card_512.png`}
                    style={{ width: "80%" }}
                  />
                </div>

                <BoxCard
                  className="mb-3"
                  content={
                    <div className="d-flex flex-row flex-fill justify-content-center">
                      <div className="me-1">
                        <ButtonMflPlayerInfo playerId={player.id} />
                      </div>

                      <div>
                        <ButtonMflPlayer playerId={player.id} />
                      </div>
                    </div>
                  }
                />
              </div>

              <div className="d-flex flex-column flex-fill">
                <BoxCard
                  className="mb-2"
                  content={
                    <div className="row w-100">
                      <div className="col-6 ps-3">
                        {player.positions.join(", ")}
                      </div>

                      <div className="col-6">
                        <i class="bi bi-cake2-fill me-1"></i>
                        {player.age}
                      </div>

                      <div className="col-6">
                        {player.nationalities && player.nationalities[0] ? (
                          <img
                            className="d-inline me-1 my-1 ms-md-1"
                            style={{ height: 13 }}
                            src={`https://app.playmfl.com/img/flags/${player.nationalities[0]}.svg`}
                          />
                        ) : (
                          ""
                        )}

                        {player.nationalities && player.nationalities
                          ? player.nationalities[0]
                          : ""}
                      </div>

                      <div className="col-6">
                        <i class="bi bi-rulers me-1"></i>
                        {player.height}
                      </div>
                    </div>
                  }
                />

                <BoxCard
                  className="mb-2 "
                  content={
                    <div className="d-flex flex-fill overflow-hidden ratio ratio-16x9">
                      {pricings ? (
                        <div className="d-flex flex-column">
                          <div className="d-flex flex-row mb-1">
                            <div className="d-flex flex-row flex-fill">
                              Estimated pricing:&nbsp;
                              <PopupInformationPricing />
                              &nbsp;
                              <span className="text-main">
                                $
                                {pricings.length > 0
                                  ? pricings[pricings.length - 1].price
                                  : "--"}
                              </span>
                            </div>
                            <div className="d-flex justify-content-end">
                              <button
                                className="btn btn-info btn-small text-white"
                                onClick={() => {
                                  navigate(
                                    `/tools/player-pricing?overall=${player.overall}&age=${player.age}&position=${player.positions[0]}`
                                  );
                                }}
                              >
                                Player pricing{" "}
                                <i class="bi bi-caret-right-fill text-white"></i>
                              </button>
                            </div>
                          </div>
                          <ChartLinePricingHistory data={pricings} />
                        </div>
                      ) : (
                        <div className="h-100 w-100">
                          <LoadingSquare />
                        </div>
                      )}
                    </div>
                  }
                />

                <BoxCard
                  className="mb-2"
                  content={
                    <div className={"row"}>
                      <div className={"col-2"}>PAC</div>
                      <div className={"col-2"}>DRI</div>
                      <div className={"col-2"}>PAS</div>
                      <div className={"col-2"}>SHO</div>
                      <div className={"col-2"}>DEF</div>
                      <div className={"col-2"}>PHY</div>
                      <div className={"col-2"}>
                        {getOverallTag(player.pace)}
                      </div>
                      <div className={"col-2"}>
                        {getOverallTag(player.dribbling)}
                      </div>
                      <div className={"col-2"}>
                        {getOverallTag(player.passing)}
                      </div>
                      <div className={"col-2"}>
                        {getOverallTag(player.shooting)}
                      </div>
                      <div className={"col-2"}>
                        {getOverallTag(player.defense)}
                      </div>
                      <div className={"col-2"}>
                        {getOverallTag(player.physical)}
                      </div>
                    </div>
                  }
                />

                <BoxCard
                  className="mb-2"
                  content={
                    <div className="d-flex flex-grow-1">
                      {getOVRs().map((o) => (
                        <div className={"me-1"}>
                          <div
                            className={"d-inline-block"}
                            style={{ width: "40px" }}
                          >
                            {o.pos}:
                          </div>
                          <div
                            className={"d-inline-block"}
                            style={{ width: "40px" }}
                          >
                            {getOverallTag(o.ovr)}
                            <small>{getDiff(o.diff)}</small>
                          </div>
                        </div>
                      ))}
                    </div>
                  }
                />
              </div>
            </div>
          </div>
        )}
      </Popup>
    </div>
  );
};

export default PopupPlayer;
