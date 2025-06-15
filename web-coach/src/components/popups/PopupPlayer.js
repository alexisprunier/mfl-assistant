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
import MiscOverallField from "components/misc/MiscOverallField.js";

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
          <div className="container bg-dark overflow-auto border border-3 rounded-3 px-2 py-4 px-md-4">
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

            <div className="d-flex flex-column flex-md-row m-1 mb-2">
              <div className="d-flex flex-column flex-md-basis-200">
                <div className="d-flex justify-content-center mb-3">
                  <img
                    src={`https://d13e14gtps4iwl.cloudfront.net/players/${player.id}/card_512.png`}
                    style={{ width: "80%" }}
                  />
                </div>

                <div className="my-2 px-2">
                  <button
                    className="btn background-mfl text-black w-100 mb-2"
                    onClick={() =>
                      window.open(
                        "https://app.playmfl.com/players/" + player.id,
                        "_blank"
                      )
                    }
                  >
                    MFL<i className="bi bi-caret-right-fill"></i>
                  </button>

                  <button
                    className="btn btn-info text-white w-100"
                    onClick={() =>
                      window.open(
                        "https://mflplayer.info/player/" + player.id,
                        "_blank"
                      )
                    }
                  >
                    Player Info<i className="bi bi-caret-right-fill"></i>
                  </button>
                </div>

                <BoxCard
                  content={
                    <div className="w-100">
                      <div className="col-12">#{player.id}</div>
                      <div className="col-12">
                        {player.positions.join(", ")}
                      </div>
                      <div className="col-6">
                        <i class="bi bi-cake2-fill me-1"></i>
                        {player.age}
                      </div>

                      <div className="col-6">
                        <i class="bi bi-rulers me-1"></i>
                        {player.height}
                      </div>
                    </div>
                  }
                />
              </div>

              <div className="d-flex flex-column flex-fill">
                <BoxCard
                  className="mb-2"
                  content={
                    <div className={"row"}>
                      <div className={"col-2 text-center"}>PAC</div>
                      <div className={"col-2 text-center"}>DRI</div>
                      <div className={"col-2 text-center"}>PAS</div>
                      <div className={"col-2 text-center"}>SHO</div>
                      <div className={"col-2 text-center"}>DEF</div>
                      <div className={"col-2 text-center"}>PHY</div>
                      <div className={"col-2 text-center"}>
                        {getOverallTag(player.pace)}
                      </div>
                      <div className={"col-2 text-center"}>
                        {getOverallTag(player.dribbling)}
                      </div>
                      <div className={"col-2 text-center"}>
                        {getOverallTag(player.passing)}
                      </div>
                      <div className={"col-2 text-center"}>
                        {getOverallTag(player.shooting)}
                      </div>
                      <div className={"col-2 text-center"}>
                        {getOverallTag(player.defense)}
                      </div>
                      <div className={"col-2 text-center"}>
                        {getOverallTag(player.physical)}
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

                <div className="d-flex flex-column flex-md-row flex-fill">
                  <BoxCard
                    className="flex-grow-1 mb-2"
                    content={
                      <div className="d-flex flex-grow-1">
                        <MiscOverallField player={player} />
                      </div>
                    }
                  />

                  <BoxCard
                    className="mb-2"
                    content={
                      <div className="d-flex flex-row flex-md-column flex-grow-1 justify-content-center">
                        {getOVRs().map((o) => (
                          <div className={"d-flex flex-md-column mb-1"}>
                            <div
                              className={
                                "d-inline-block text-center line-height-1"
                              }
                              style={{ width: "40px" }}
                            >
                              {o.pos}
                            </div>
                            <div
                              className={
                                "d-inline-block text-center line-height-1"
                              }
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
          </div>
        )}
      </Popup>
    </div>
  );
};

export default PopupPlayer;
