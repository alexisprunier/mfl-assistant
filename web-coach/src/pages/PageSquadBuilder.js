import BoxLogin from "components/box/BoxLogin.js";
import BoxMessage from "components/box/BoxMessage.js";
import ButtonLogin from "components/buttons/ButtonLogin.js";
import ButtonOnFieldPlayerView from "components/buttons/ButtonOnFieldPlayerView.js";
import ButtonPlayerView from "components/buttons/ButtonPlayerView.js";
import Count from "components/counts/Count.js";
import ItemRowPlayerAssist from "components/items/ItemRowPlayerAssist.js";
import ItemTeam from "components/items/ItemTeam.js";
import LoadingSquare from "components/loading/LoadingSquare.js";
import MiscFlag from "components/misc/MiscFlag.js";
import MiscOverall from "components/misc/MiscOverall.js";
import PopupAddPlayers from "components/popups/PopupAddPlayers.js";
import PopupAddTeam from "components/popups/PopupAddTeam.js";
import PopupEditTeam from "components/popups/PopupEditTeam.js";
import PopupSelectPlayer from "components/popups/PopupSelectPlayer.js";
import BoxCard from "components/box/BoxCard.js";
import React, { useEffect, useState } from "react";
import {
  addTeamMembers,
  deleteTeamMember,
  getTeams,
  updateTeam,
  updateTeamMember,
} from "services/api-assistant.js";
import { formations } from "utils/formation.js";

interface PageSquadBuilderProps {}

const PageSquadBuilder: React.FC<PageSquadBuilderProps> = (props) => {
  const [isLoading, setIsLoading] = useState(false);

  const [teams, setTeams] = useState(null);
  //const [selectedTeam, setSelectedTeam] = useState(null);
  //const [teamMembers, setTeamMembers] = useState(null);

  const [playerView, setPlayerView] = useState(null);
  const [onFieldPlayerView, setOnFieldPlayerView] = useState(null);
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
          {(isLoading || !teams) && (
            <div
              className="position-absolute w-100 h-100"
              style={{ zIndex: "800", top: 0, left: 0 }}
            >
              <LoadingSquare />
            </div>
          )}

          <BoxCard
            className="pb-2"
            content={
              <div className="d-flex flex-column flex-md-row flex-fill">
                <div className="d-flex flex-grow-1">
                  <h4>
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
                            <i className="bi bi-plus-circle-fill"></i> Add
                            players
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
                            onChange={(v) =>
                              saveTeam(t.id, { formation: v.target.value })
                            }
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
                              <div
                                className="position-absolute"
                                style={{ top: "1px", right: "1px" }}
                              >
                                <ButtonOnFieldPlayerView
                                  selectedView={onFieldPlayerView}
                                  onChange={(v) => setOnFieldPlayerView(v)}
                                />
                              </div>

                              {t.formation &&
                                Object.keys(formations[t.formation]).map(
                                  (p) => (
                                    <div
                                      style={{
                                        position: "absolute",
                                        top: formations[t.formation][p].y + "%",
                                        left:
                                          formations[t.formation][p].x + "%",
                                        transform: "translate(-50%,-50%)",
                                      }}
                                    >
                                      {getTeamMemberInPosition(
                                        t,
                                        parseInt(p)
                                      ) ? (
                                        <div
                                          className="d-flex flex-column transform-scale-sm-80"
                                          style={{
                                            lineHeight: 1.1,
                                            backgroundColor:
                                              "rgba(33, 37, 41, .9)",
                                            color: "#fff",
                                            borderRadius: "8px",
                                            justifyContent: "center",
                                            alignItems: "center",
                                            width: "80px",
                                            cursor: "pointer",
                                            padding: "2px",
                                          }}
                                          onClick={() =>
                                            saveTeamMember(
                                              getTeamMemberInPosition(
                                                t,
                                                parseInt(p)
                                              ).id,
                                              null
                                            )
                                          }
                                        >
                                          <div
                                            className="text-white text-center text-truncate w-100"
                                            style={{
                                              textShadow: "black 0px 0px 2px",
                                            }}
                                          >
                                            {
                                              getTeamMemberInPosition(
                                                t,
                                                parseInt(p)
                                              ).player.lastName
                                            }
                                          </div>
                                          <div className="d-flex flex-row">
                                            <div
                                              className="d-flex flex-grow-1"
                                              style={{
                                                textShadow: "black 0px 0px 1px",
                                              }}
                                            >
                                              {(onFieldPlayerView == null ||
                                                onFieldPlayerView ===
                                                  "ovr") && (
                                                <MiscOverall
                                                  player={
                                                    getTeamMemberInPosition(
                                                      t,
                                                      parseInt(p)
                                                    ).player
                                                  }
                                                  actualPosition={formations[
                                                    t.formation
                                                  ][
                                                    getTeamMemberInPosition(
                                                      t,
                                                      parseInt(p)
                                                    ).position
                                                  ].position.toString()}
                                                  calculatedOvr={true}
                                                />
                                              )}

                                              {onFieldPlayerView ===
                                                "profile" && (
                                                <div className="d-flex text-white align-item-center">
                                                  <MiscFlag
                                                    country={
                                                      getTeamMemberInPosition(
                                                        t,
                                                        parseInt(p)
                                                      ).player.nationalities[0]
                                                    }
                                                  />
                                                  &nbsp;
                                                  {
                                                    getTeamMemberInPosition(
                                                      t,
                                                      parseInt(p)
                                                    ).player.age
                                                  }
                                                  -
                                                  {
                                                    getTeamMemberInPosition(
                                                      t,
                                                      parseInt(p)
                                                    ).player.height
                                                  }
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
                                                {
                                                  formations[t.formation][p]
                                                    .position
                                                }
                                              </button>
                                            }
                                            teamMembers={t.teamMembers}
                                            onConfirm={(m) =>
                                              saveTeamMember(m.id, parseInt(p))
                                            }
                                          />
                                        </div>
                                      )}
                                    </div>
                                  )
                                )}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="d-flex flex-grow-1 m-2">
                        <div className="d-flex flex-fill flex-column overflow-auto">
                          {t.teamMembers?.length === 0 && (
                            <BoxMessage
                              className={"py-4 py-md-0"}
                              content={"No player in the group"}
                            />
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
                                    onChange={() =>
                                      setShowOnfieldPlayers(!showOnfieldPlayers)
                                    }
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
                                  .filter(
                                    (p) => !p.position || showOnfieldPlayers
                                  )
                                  .sort(
                                    (a, b) =>
                                      b.player.overall - a.player.overall
                                  )
                                  .map((p) => (
                                    <div className="d-flex flex-row">
                                      <div className="d-flex flex-grow-1 me-1">
                                        <ItemRowPlayerAssist
                                          p={p.player}
                                          display={playerView}
                                        />
                                      </div>

                                      <button
                                        className="btn btn-small text-danger"
                                        onClick={() =>
                                          deleteTeamMemberInGroup(p.id)
                                        }
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
          {/*<div className="d-flex flex-column flex-md-row h-100 w-100 fade-in">
            <div className="d-flex flex-column flex-md-grow-0 flex-md-basis-300">
              <div className="card d-flex flex-column flex-md-grow-1 m-2 p-3 pt-2">
                <div className="d-flex flex-row flex-md-grow-0">
                  <h4 className="flex-grow-1">My teams</h4>

                  <PopupAddTeam
                    trigger={
                      <button className="btn btn-info btn-sm text-white">
                        <i className="bi bi-plus"></i>
                      </button>
                    }
                    onClose={fetchTeams}
                  />
                </div>

                <div className="d-flex flex-fill flex-column">
                  {(isLoading || !teams) && <LoadingSquare />}

                  {!isLoading && teams && teams.length === 0 && (
                    <BoxMessage
                      className={"py-4 py-md-0"}
                      content={"No team found"}
                    />
                  )}

                  {!isLoading &&
                    teams &&
                    teams.length > 0 &&
                    teams.map((t) => (
                      <div className="d-flex flex-row">
                        <div className="d-flex flex-grow-1 me-1">
                          <ItemTeam
                            team={t}
                            isSelected={t.id === selectedTeam}
                            onSelect={(t) =>
                              setSelectedTeam(
                                selectedTeam === t.id ? null : t.id
                              )
                            }
                          />
                        </div>

                        <PopupEditTeam
                          team={t}
                          trigger={
                            <button className="btn btn-small text-info">
                              <i className="bi bi-pencil-square" />
                            </button>
                          }
                          onClose={() => fetchTeams()}
                          onUpdate={() => fetchTeams(false)}
                        />
                      </div>
                    ))}
                </div>
              </div>

              <div className="card d-flex flex-column flex-fill m-2 p-3 pt-2">
                <div className="d-flex flex-row">
                  <div className="d-flex">
                    <h4 className="flex-grow-1">Team details</h4>
                  </div>
                </div>

                <div className="d-flex flex-fill overflow-hidden">
                  {selectedTeam ? (
                    <div className="d-flex flex-column flex-grow-1">
                      <div className="d-flex flex-row flex-grow-1">
                        <div
                          className="d-flex flex-column flex-grow-1 flex-basis-0 align-items-center justify-content-center py-4 py-md-0"
                          style={{ transform: "scale(0.8)" }}
                        >
                          <Count
                            label="Group size"
                            count={teamMembers ? teamMembers.length : 0}
                          />
                        </div>
                        <div
                          className="d-flex flex-column flex-grow-1 flex-basis-0 align-items-center justify-content-center py-4 py-md-0"
                          style={{ transform: "scale(0.8)" }}
                        >
                          <Count
                            label="Group AVR"
                            count={
                              teamMembers && teamMembers.length > 0
                                ? Number(
                                    teamMembers
                                      .map((tm) => tm.player.overall)
                                      .reduce((acc, cur) => acc + cur) /
                                      teamMembers.length
                                  ).toFixed(1)
                                : 0
                            }
                          />
                        </div>
                      </div>

                      <div className="d-flex flex-row flex-grow-1">
                        <div
                          className="d-flex flex-column flex-grow-1 flex-basis-0 align-items-center justify-content-center py-4 py-md-0"
                          style={{ transform: "scale(0.8)" }}
                        >
                          <Count
                            label="Starter OVR"
                            count={
                              teamMembers &&
                              teamMembers.filter((tm) => tm.position).length > 0
                                ? teamMembers
                                    .filter((tm) => tm.position)
                                    .map((tm) => tm.player.overall)
                                    .reduce((acc, cur) => acc + cur)
                                : 0
                            }
                          />
                        </div>
                        <div
                          className="d-flex flex-column flex-grow-1 flex-basis-0 align-items-center justify-content-center py-4 py-md-0"
                          style={{ transform: "scale(0.8)" }}
                        >
                          <Count
                            label="Starter AVR"
                            count={
                              teamMembers &&
                              teamMembers.filter((tm) => tm.position).length > 0
                                ? Number(
                                    teamMembers
                                      .filter((tm) => tm.position)
                                      .map((tm) => tm.player.overall)
                                      .reduce((acc, cur) => acc + cur) /
                                      teamMembers.filter((tm) => tm.position)
                                        .length
                                  ).toFixed(1)
                                : 0
                            }
                          />
                        </div>
                      </div>

                      <div className="d-flex flex-row flex-grow-1">
                        <div
                          className="d-flex flex-column flex-grow-1 flex-basis-0 align-items-center justify-content-center py-4 py-md-0"
                          style={{ transform: "scale(0.8)" }}
                        >
                          <Count
                            label="B11 OVR"
                            count={
                              teamMembers && teamMembers.length > 0
                                ? teamMembers
                                    .map((tm) => tm.player.overall)
                                    .sort((a, b) => b - a)
                                    .slice(0, 11)
                                    .reduce((acc, cur) => acc + cur, 0)
                                : 0
                            }
                          />
                        </div>
                        <div
                          className="d-flex flex-column flex-grow-1 flex-basis-0 align-items-center justify-content-center py-4 py-md-0"
                          style={{ transform: "scale(0.8)" }}
                        >
                          <Count
                            label="B11 AVR"
                            count={
                              teamMembers && teamMembers.length > 0
                                ? Number(
                                    teamMembers
                                      .map((tm) => tm.player.overall)
                                      .sort((a, b) => b - a)
                                      .slice(0, 11)
                                      .reduce((acc, cur) => acc + cur, 0) /
                                      teamMembers
                                        .map((tm) => tm.player.overall)
                                        .sort((a, b) => b - a)
                                        .slice(0, 11).length
                                  ).toFixed(1)
                                : 0
                            }
                          />
                        </div>
                      </div>

                      <div className="d-flex flex-row flex-grow-1">
                        <div
                          className="d-flex flex-column flex-grow-1 flex-basis-0 align-items-center justify-content-center py-4 py-md-0"
                          style={{ transform: "scale(0.8)" }}
                        >
                          <Count
                            label="B16 OVR"
                            count={
                              teamMembers && teamMembers.length > 0
                                ? teamMembers
                                    .map((tm) => tm.player.overall)
                                    .sort((a, b) => b - a)
                                    .slice(0, 16)
                                    .reduce((acc, cur) => acc + cur, 0)
                                : 0
                            }
                          />
                        </div>
                        <div
                          className="d-flex flex-column flex-grow-1 flex-basis-0 align-items-center justify-content-center py-4 py-md-0"
                          style={{ transform: "scale(0.8)" }}
                        >
                          <Count
                            label="B16 AVR"
                            count={
                              teamMembers && teamMembers.length > 0
                                ? Number(
                                    teamMembers
                                      .map((tm) => tm.player.overall)
                                      .sort((a, b) => b - a)
                                      .slice(0, 16)
                                      .reduce((acc, cur) => acc + cur, 0) /
                                      teamMembers
                                        .map((tm) => tm.player.overall)
                                        .sort((a, b) => b - a)
                                        .slice(0, 16).length
                                  ).toFixed(1)
                                : 0
                            }
                          />
                        </div>
                      </div>
                    </div>
                  ) : (
                    <BoxMessage
                      className={"py-4 py-md-0"}
                      content={"No team selected"}
                    />
                  )}
                </div>
              </div>
            </div>

            <div className="d-flex flex-column flex-md-column flex-md-column-reverse flex-md-grow-1">
              <div className="card d-flex flex-column flex-md-grow-1 flex-md-shrink-1 m-2 p-3 pt-2">
                <div className="d-flex flex-row">
                  <h4 className="flex-grow-1">Formation</h4>

                  {selectedTeam && (
                    <div className="d-flex flex-grow-0">
                      <select
                        className="form-select w-100 mb-1"
                        value={getSelectedTeam().formation}
                        onChange={(v) =>
                          saveTeam({ formation: v.target.value })
                        }
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
                  )}
                </div>

                <div className="d-flex flex-fill overflow-hidden ratio-sm ratio-sm-1x1">
                  {selectedTeam && getSelectedTeam().formation ? (
                    <div className="d-flex flex-fill flex-column">
                      <div className="d-flex justify-content-end flex-grow-0">
                        <ButtonOnFieldPlayerView
                          selectedView={onFieldPlayerView}
                          onChange={(v) => setOnFieldPlayerView(v)}
                        />
                      </div>

                      <div className="d-flex flex-fill flex-grow-1">
                        <div className="d-block position-relative h-100 w-100 football-field rounded-2">
                          {Object.keys(
                            formations[getSelectedTeam().formation]
                          ).map((p) => (
                            <div
                              style={{
                                position: "absolute",
                                top:
                                  formations[getSelectedTeam().formation][p].y +
                                  "%",
                                left:
                                  formations[getSelectedTeam().formation][p].x +
                                  "%",
                                transform: "translate(-50%,-50%)",
                              }}
                            >
                              {getTeamMemberInPosition(parseInt(p)) ? (
                                <div
                                  className="d-flex flex-column transform-scale-sm-80"
                                  style={{ lineHeight: 1.3 }}
                                >
                                  <div
                                    className="text-white"
                                    style={{ textShadow: "black 0px 0px 2px" }}
                                  >
                                    {
                                      getTeamMemberInPosition(parseInt(p))
                                        .player.lastName
                                    }
                                  </div>
                                  <div className="d-flex flex-row">
                                    <div className="d-flex align-items-center flex-wrap me-1">
                                      <MiscFlag
                                        country={
                                          getTeamMemberInPosition(parseInt(p))
                                            .player.nationalities[0]
                                        }
                                      />
                                    </div>

                                    <div
                                      className="d-flex flex-grow-1"
                                      style={{
                                        textShadow: "black 0px 0px 1px",
                                      }}
                                    >
                                      {(onFieldPlayerView == null ||
                                        onFieldPlayerView === "ovr") && (
                                        <MiscOverall
                                          player={
                                            getTeamMemberInPosition(parseInt(p))
                                              .player
                                          }
                                          actualPosition={formations[
                                            getSelectedTeam().formation
                                          ][
                                            getTeamMemberInPosition(parseInt(p))
                                              .position
                                          ].position.toString()}
                                          calculatedOvr={true}
                                        />
                                      )}

                                      {onFieldPlayerView === "age" && (
                                        <div className="text-white">
                                          <i className="bi bi-cake2-fill me-1"></i>
                                          {
                                            getTeamMemberInPosition(parseInt(p))
                                              .player.age
                                          }
                                        </div>
                                      )}
                                    </div>

                                    <button
                                      className="btn btn-small text-danger"
                                      onClick={() =>
                                        saveTeamMember(
                                          getTeamMemberInPosition(parseInt(p))
                                            .id,
                                          null
                                        )
                                      }
                                    >
                                      <i className="bi bi-person-fill-x"></i>
                                    </button>
                                  </div>
                                </div>
                              ) : (
                                <div className="transform-scale-sm-80">
                                  <PopupSelectPlayer
                                    trigger={
                                      <button className="btn btn-info btn-small text-white">
                                        <i className="bi bi-person-fill-add me-1" />
                                        {
                                          formations[
                                            getSelectedTeam().formation
                                          ][p].position
                                        }
                                      </button>
                                    }
                                    teamMembers={teamMembers}
                                    onConfirm={(m) =>
                                      saveTeamMember(m.id, parseInt(p))
                                    }
                                  />
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <BoxMessage content={"No formation selected"} />
                  )}
                </div>
              </div>

              <div className="card d-flex flex-column flex-md-grow-1 flex-md-shrink-1 flex-md-basis-auto flex-basis-0 m-2 p-3 pt-2 max-height-md-300">
                <div className="d-flex flex-row flex-md-grow-0">
                  <h4 className="flex-grow-1">Player group</h4>

                  {selectedTeam && (
                    <PopupAddPlayers
                      trigger={
                        <button className="btn btn-info btn-sm text-white">
                          <i className="bi bi-plus"></i>
                        </button>
                      }
                      onConfirm={(players) =>
                        addTeamMembersInGroup(players.map((p) => p.id))
                      }
                      userId={props.assistantUser.id}
                    />
                  )}
                </div>

                <div className="d-flex flex-fill flex-column overflow-auto">
                  {!selectedTeam && (
                    <BoxMessage
                      className={"py-4 py-md-0"}
                      content={"No team selected"}
                    />
                  )}

                  {selectedTeam && teamMembers === null && <LoadingSquare />}

                  {selectedTeam && teamMembers?.length === 0 && (
                    <BoxMessage
                      className={"py-4 py-md-0"}
                      content={"No player in the group"}
                    />
                  )}

                  {selectedTeam && teamMembers && teamMembers.length > 0 && (
                    <div className="d-flex flex-fill flex-column overflow-hidden">
                      <div className="d-flex flex-grow-0 justify-content-end mb-2">
                        <small>
                          Show on-field players
                          <input
                            type="checkbox"
                            className="ms-1"
                            value={showOnfieldPlayers}
                            onChange={() =>
                              setShowOnfieldPlayers(!showOnfieldPlayers)
                            }
                          />
                        </small>

                        <ButtonPlayerView
                          selectedView={playerView}
                          onChange={(v) => setPlayerView(v)}
                          displayOwner={true}
                        />
                      </div>

                      <div className="d-flex flex-column flex-grow-1 overflow-auto">
                        {teamMembers
                          .filter((p) => !p.position || showOnfieldPlayers)
                          .map((p) => (
                            <div className="d-flex flex-row">
                              <div className="d-flex flex-grow-1 me-1">
                                <ItemRowPlayerAssist
                                  p={p.player}
                                  display={playerView}
                                />
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
          </div>*/}
        </div>
      </div>
    </div>
  );
};

export default PageSquadBuilder;
