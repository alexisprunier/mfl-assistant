import BoxCard from "components/box/BoxCard.js";
import BoxLogin from "components/box/BoxLogin.js";
import BoxMessage from "components/box/BoxMessage.js";
import ButtonLogin from "components/buttons/ButtonLogin.js";
import ButtonOnFieldPlayerView from "components/buttons/ButtonOnFieldPlayerView.js";
import ButtonPlayerView from "components/buttons/ButtonPlayerView.js";
import ItemRowPlayerAssist from "components/items/ItemRowPlayerAssist.js";
import LoadingSquare from "components/loading/LoadingSquare.js";
import MiscFlag from "components/misc/MiscFlag.js";
import MiscOverall from "components/misc/MiscOverall.js";
import PopupAddPlayers from "components/popups/PopupAddPlayers.js";
import PopupAddTeam from "components/popups/PopupAddTeam.js";
import PopupEditTeam from "components/popups/PopupEditTeam.js";
import PopupSelectPlayer from "components/popups/PopupSelectPlayer.js";
import React, { useEffect, useState } from "react";
import { addTeamMembers, deleteTeamMember, getTeams, updateTeam, updateTeamMember } from "services/api-assistant.js";
import { formations } from "utils/formation.js";
import { getCalculatedOverall, getOverallColor } from "utils/player.js";

interface PageSquadBuilderProps {}

const PageSquadBuilder: React.FC<PageSquadBuilderProps> = (props) => {
  const [isLoading, setIsLoading] = useState(false);

  const [teams, setTeams] = useState(null);

  const [playerView, setPlayerView] = useState(null);
  const [onFieldPlayerView, setOnFieldPlayerView] = useState(null);
  const [onFieldAttributeView, setOnFieldAttributeView] = useState(null);
  const [showOnfieldPlayers, setShowOnfieldPlayers] = useState(false);

  const fetchTeams = (triggerLoading = true) => {
    if (props.assistantUser) {
      if (triggerLoading) {
        setIsLoading(true);
      }

      getTeams({
        handleSuccess: (v) => {
          setTeams(v.data.getTeams);
          setIsLoading(false);
        },
      });
    }
  };

  const addTeamMembersInGroup = (teamId, playerIds) => {
    addTeamMembers({
      handleSuccess: (v) => {
        fetchTeams();
      },
      params: {
        teamId,
        playerIds,
      },
    });
  };

  const deleteTeamMemberInGroup = (id) => {
    deleteTeamMember({
      handleSuccess: (v) => {
        fetchTeams();
      },
      params: {
        teamMemberId: id,
      },
    });
  };

  const saveTeam = (teamId, data) => {
    updateTeam({
      handleSuccess: (v) => {
        fetchTeams(false);
      },
      params: {
        id: teamId,
        ...data,
      },
    });
  };

  const saveTeamMember = (id, position) => {
    updateTeamMember({
      handleSuccess: (v) => {
        fetchTeams();
      },
      params: {
        id,
        position,
      },
    });
  };

  const getTeamMemberInPosition = (t, position) => {
    if (!t.teamMembers) {
      return null;
    }

    return t.teamMembers.filter((tm) => tm.position === position).pop();
  };

  useEffect(() => {
    fetchTeams();
  }, []);

  useEffect(() => {
    if (props.assistantUser) {
      fetchTeams();
    }
  }, [props.assistantUser]);

  if (!props.assistantUser) {
    return (
      <div className="d-flex h-100 justify-content-center align-items-center">
        <ButtonLogin
          flowUser={props.flowUser}
          assistantUser={props.assistantUser}
          logout={props.logout}
          content={<BoxLogin assistantUser={props.assistantUser} />}
        />
      </div>
    );
  }

  return (
    <div id="PageToolsMatchAnalysis" className="h-100 w-100">
      <div className="h-100 w-100">
        <nav className="TopBar navbar w-100 px-4 py-2">
          <h3 className="my-2 ps-5">
            <i className="bi bi-clipboard2-check-fill me-2"></i> Squad builder
          </h3>
        </nav>

        <div className="position-relative container-xl px-md-4 py-4">
          <BoxCard
            className="pb-2"
            content={
              isLoading || !teams ? (
                <div className="w-100" style={{ height: "40px" }}>
                  <LoadingSquare />
                </div>
              ) : (
                <div className="d-flex flex-column flex-md-row flex-fill">
                  <div className="d-flex flex-grow-1 align-content-center">
                    <h4 className="mb-0 mt-1">
                      {teams ? teams.length : "?"} team
                      {teams && teams.length > 1 && "s"}
                    </h4>
                  </div>
                  <div className="d-flex justify-content-end">
                    <PopupAddTeam
                      trigger={
                        <button className="btn btn-info text-white">
                          <i className="bi bi-plus-circle-fill"></i> Add Team
                        </button>
                      }
                      onClose={fetchTeams}
                    />
                  </div>
                </div>
              )
            }
          />

          {teams &&
            teams.map((t) => (
              <div className="d-flex flex-column">
                <BoxCard
                  className="mb-2 flex-md-basis-300"
                  title={t.name}
                  actions={
                    <>
                      <PopupEditTeam
                        team={t}
                        trigger={
                          <button className="btn btn-info text-white me-1 mb-1">
                            <i className="bi bi-pencil-square" />
                          </button>
                        }
                        onClose={() => fetchTeams()}
                        onUpdate={() => fetchTeams(false)}
                      />
                      <PopupAddPlayers
                        trigger={
                          <button className="btn btn-info text-white mb-1">
                            <i className="bi bi-plus-circle-fill"></i> Add players
                          </button>
                        }
                        onConfirm={(players) =>
                          addTeamMembersInGroup(
                            t.id,
                            players.map((p) => p.id)
                          )
                        }
                        userId={props.assistantUser.id}
                      />
                    </>
                  }
                  content={
                    <div className="d-flex flex-fill flex-column flex-md-row">
                      <div className="d-flex flex-column flex-md-basis-400">
                        <div className="d-flex flex-row">
                          <select
                            className="form-select mb-1 w-100"
                            value={t.formation}
                            onChange={(v) => saveTeam(t.id, { formation: v.target.value })}
                            placeholder={"Formation"}
                          >
                            <option value={""} key={null} />
                            {Object.keys(formations).map((f) => (
                              <option value={f} key={f}>
                                {f}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div className="d-flex flex-row">
                          <div className="position-relative d-flex ratio ratio-1x1 flex-md-basis-400">
                            <div className="position-relative rounded-2 football-field">
                              <div className="position-absolute" style={{ top: "1px", right: "1px" }}>
                                <ButtonOnFieldPlayerView
                                  selectedView={onFieldPlayerView}
                                  selectedAttribute={onFieldAttributeView}
                                  onChange={(v) => setOnFieldPlayerView(v)}
                                  onAttributeChange={(v) => setOnFieldAttributeView(v)}
                                />
                              </div>

                              <div
                                className="position-absolute text-small text-dark"
                                style={{
                                  top: "3px",
                                  left: "5px",
                                  opacity: ".8",
                                }}
                              >
                                Starter:{" "}
                                {t.teamMembers && t.formation && t.teamMembers.filter((tm) => tm.position).length > 0
                                  ? t.teamMembers
                                      .filter((tm) => tm.position)
                                      .map((tm) =>
                                        getCalculatedOverall(tm.player, formations[t.formation][tm.position].position)
                                      )
                                      .reduce((acc, cur) => acc + cur)
                                  : 0}{" "}
                                -{" "}
                                {t.teamMembers && t.formation && t.teamMembers.filter((tm) => tm.position).length > 0
                                  ? Number(
                                      t.teamMembers
                                        .filter((tm) => tm.position)
                                        .map((tm) =>
                                          getCalculatedOverall(tm.player, formations[t.formation][tm.position].position)
                                        )
                                        .reduce((acc, cur) => acc + cur) /
                                        t.teamMembers.filter((tm) => tm.position).length
                                    ).toFixed(1)
                                  : 0}
                              </div>

                              <div
                                className="position-absolute text-small text-dark"
                                style={{
                                  bottom: "3px",
                                  left: "5px",
                                  opacity: ".8",
                                }}
                              >
                                B11:{" "}
                                {t.teamMembers && t.teamMembers.length > 0
                                  ? t.teamMembers
                                      .map((tm) => tm.player.overall)
                                      .sort((a, b) => b - a)
                                      .slice(0, 11)
                                      .reduce((acc, cur) => acc + cur, 0)
                                  : 0}{" "}
                                -{" "}
                                {t.teamMembers && t.teamMembers.length > 0
                                  ? Number(
                                      t.teamMembers
                                        .map((tm) => tm.player.overall)
                                        .sort((a, b) => b - a)
                                        .slice(0, 11)
                                        .reduce((acc, cur) => acc + cur, 0) /
                                        t.teamMembers
                                          .map((tm) => tm.player.overall)
                                          .sort((a, b) => b - a)
                                          .slice(0, 11).length
                                    ).toFixed(1)
                                  : 0}
                              </div>

                              <div
                                className="position-absolute text-small text-dark"
                                style={{
                                  bottom: "3px",
                                  right: "5px",
                                  opacity: ".8",
                                }}
                              >
                                B16:{" "}
                                {t.teamMembers && t.teamMembers.length > 0
                                  ? t.teamMembers
                                      .map((tm) => tm.player.overall)
                                      .sort((a, b) => b - a)
                                      .slice(0, 16)
                                      .reduce((acc, cur) => acc + cur, 0)
                                  : 0}{" "}
                                -{" "}
                                {t.teamMembers && t.teamMembers.length > 0
                                  ? Number(
                                      t.teamMembers
                                        .map((tm) => tm.player.overall)
                                        .sort((a, b) => b - a)
                                        .slice(0, 16)
                                        .reduce((acc, cur) => acc + cur, 0) /
                                        t.teamMembers
                                          .map((tm) => tm.player.overall)
                                          .sort((a, b) => b - a)
                                          .slice(0, 16).length
                                    ).toFixed(1)
                                  : 0}
                              </div>

                              {t.formation &&
                                Object.keys(formations[t.formation]).map((p) => (
                                  <div
                                    style={{
                                      position: "absolute",
                                      top: formations[t.formation][p].y + "%",
                                      left: formations[t.formation][p].x + "%",
                                      transform: "translate(-50%,-50%)",
                                    }}
                                  >
                                    {getTeamMemberInPosition(t, parseInt(p)) ? (
                                      <div
                                        className="d-flex flex-column transform-scale-sm-80"
                                        style={{
                                          lineHeight: 1.1,
                                          backgroundColor: "rgba(33, 37, 41, .9)",
                                          color: "#fff",
                                          borderRadius: "8px",
                                          justifyContent: "center",
                                          alignItems: "center",
                                          width: "80px",
                                          cursor: "pointer",
                                          padding: "2px",
                                        }}
                                        onClick={() => saveTeamMember(getTeamMemberInPosition(t, parseInt(p)).id, null)}
                                      >
                                        <div
                                          className="text-white text-center text-truncate w-100"
                                          style={{
                                            textShadow: "black 0px 0px 2px",
                                          }}
                                        >
                                          {getTeamMemberInPosition(t, parseInt(p)).player.lastName}
                                        </div>
                                        <div className="d-flex flex-row">
                                          <div
                                            className="d-flex flex-grow-1"
                                            style={{
                                              textShadow: "black 0px 0px 1px",
                                            }}
                                          >
                                            {(onFieldPlayerView == null || onFieldPlayerView === "ovr") && (
                                              <MiscOverall
                                                player={getTeamMemberInPosition(t, parseInt(p)).player}
                                                actualPosition={formations[t.formation][
                                                  getTeamMemberInPosition(t, parseInt(p)).position
                                                ].position.toString()}
                                                calculatedOvr={true}
                                              />
                                            )}

                                            {onFieldPlayerView === "profile" && (
                                              <div className="d-flex text-white align-item-center">
                                                <MiscFlag
                                                  country={
                                                    getTeamMemberInPosition(t, parseInt(p)).player.nationalities[0]
                                                  }
                                                />
                                                &nbsp;
                                                {getTeamMemberInPosition(t, parseInt(p)).player.age}-
                                                {getTeamMemberInPosition(t, parseInt(p)).player.height}
                                              </div>
                                            )}

                                            {onFieldPlayerView === "attr" &&
                                              (!onFieldAttributeView || onFieldAttributeView == "pac") && (
                                                <div className="d-flex text-white align-item-center">
                                                  <span
                                                    style={{
                                                      color: getOverallColor(
                                                        getTeamMemberInPosition(t, parseInt(p)).player.pace
                                                      ),
                                                    }}
                                                  >
                                                    {getTeamMemberInPosition(t, parseInt(p)).player.pace}
                                                  </span>
                                                  -
                                                  <span
                                                    style={{
                                                      color: getOverallColor(
                                                        getTeamMemberInPosition(t, parseInt(p)).player.shooting
                                                      ),
                                                    }}
                                                  >
                                                    {getTeamMemberInPosition(t, parseInt(p)).player.shooting}
                                                  </span>
                                                </div>
                                              )}

                                            {onFieldPlayerView === "attr" && onFieldAttributeView == "dri" && (
                                              <div className="d-flex text-white align-item-center">
                                                <span
                                                  style={{
                                                    color: getOverallColor(
                                                      getTeamMemberInPosition(t, parseInt(p)).player.dribbling
                                                    ),
                                                  }}
                                                >
                                                  {getTeamMemberInPosition(t, parseInt(p)).player.dribbling}
                                                </span>
                                                -
                                                <span
                                                  style={{
                                                    color: getOverallColor(
                                                      getTeamMemberInPosition(t, parseInt(p)).player.passing
                                                    ),
                                                  }}
                                                >
                                                  {getTeamMemberInPosition(t, parseInt(p)).player.passing}
                                                </span>
                                              </div>
                                            )}

                                            {onFieldPlayerView === "attr" && onFieldAttributeView == "def" && (
                                              <div className="d-flex text-white align-item-center">
                                                <span
                                                  style={{
                                                    color: getOverallColor(
                                                      getTeamMemberInPosition(t, parseInt(p)).player.defense
                                                    ),
                                                  }}
                                                >
                                                  {getTeamMemberInPosition(t, parseInt(p)).player.defense}
                                                </span>
                                                -
                                                <span
                                                  style={{
                                                    color: getOverallColor(
                                                      getTeamMemberInPosition(t, parseInt(p)).player.physical
                                                    ),
                                                  }}
                                                >
                                                  {getTeamMemberInPosition(t, parseInt(p)).player.physical}
                                                </span>
                                              </div>
                                            )}
                                          </div>
                                        </div>
                                      </div>
                                    ) : (
                                      <div className="transform-scale-sm-80">
                                        <PopupSelectPlayer
                                          trigger={
                                            <button className="btn btn-info btn-small text-white">
                                              <i className="bi bi-person-fill-add me-1" />
                                              {formations[t.formation][p].position}
                                            </button>
                                          }
                                          teamMembers={t.teamMembers}
                                          onConfirm={(m) => saveTeamMember(m.id, parseInt(p))}
                                        />
                                      </div>
                                    )}
                                  </div>
                                ))}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="d-flex flex-grow-1 m-2">
                        <div className="d-flex flex-fill flex-column overflow-auto">
                          {t.teamMembers?.length === 0 && (
                            <BoxMessage className={"py-4 py-md-0"} content={"No player in the group"} />
                          )}

                          {t.teamMembers.length > 0 && (
                            <div className="d-flex flex-fill flex-column overflow-hidden">
                              <div className="d-flex flex-grow-0 justify-content-end mb-2">
                                <small>
                                  Show on-field players
                                  <input
                                    type="checkbox"
                                    className="m-1"
                                    checked={showOnfieldPlayers}
                                    onChange={() => setShowOnfieldPlayers(!showOnfieldPlayers)}
                                  />
                                </small>

                                <ButtonPlayerView
                                  selectedView={playerView}
                                  onChange={(v) => setPlayerView(v)}
                                  displayOwner={true}
                                />
                              </div>

                              <div className="d-flex flex-column flex-grow-1 overflow-auto">
                                {t.teamMembers
                                  .filter((p) => !p.position || showOnfieldPlayers)
                                  .sort((a, b) => b.player.overall - a.player.overall)
                                  .map((p) => (
                                    <div className="d-flex flex-row">
                                      <div className="d-flex flex-grow-1 me-1">
                                        <ItemRowPlayerAssist p={p.player} display={playerView} />
                                      </div>

                                      <button
                                        className="btn btn-small text-danger"
                                        onClick={() => deleteTeamMemberInGroup(p.id)}
                                      >
                                        <i className="bi bi-x-circle" />
                                      </button>
                                    </div>
                                  ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  }
                />
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default PageSquadBuilder;
