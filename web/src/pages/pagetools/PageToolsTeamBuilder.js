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
import React, { useEffect, useState } from "react";
import {
  addTeamMembers,
  deleteTeamMember,
  getTeamMembers,
  getTeams,
  updateTeam,
  updateTeamMember,
} from "services/api-assistant.js";
import { formations } from "utils/formation.js";

interface PageToolsTeamBuilderProps {}

const PageToolsTeamBuilder: React.FC < PageToolsTeamBuilderProps > = (props) => {
  const [isLoading, setIsLoading] = useState(false);

  const [teams, setTeams] = useState(null);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [teamMembers, setTeamMembers] = useState(null);

  const [playerView, setPlayerView] = useState(null);
  const [onFieldPlayerView, setOnFieldPlayerView] = useState(null);
  const [showOnfieldPlayers, setShowOnfieldPlayers] = useState(false);

  const fetchTeams = (triggerLoading = true) => {
    if (props.assistantUser) {
      if (triggerLoading) {
        setIsLoading(true);
        setSelectedTeam(null);
        setTeams(null);
        setTeamMembers(null);
      }

      getTeams({
        handleSuccess: (v) => {
          setTeams(v.data.getTeams);
          setIsLoading(false);
        },
      });
    }
  };

  const fetchTeamMembers = () => {
    setTeamMembers(null);

    getTeamMembers({
      handleSuccess: (v) => {
        setTeamMembers(v.data.getTeamMembers);
      },
      params: {
        team: selectedTeam,
      },
    });
  };

  const addTeamMembersInGroup = (playerIds) => {
    addTeamMembers({
      handleSuccess: (v) => {
        fetchTeamMembers();
      },
      params: {
        teamId: selectedTeam,
        playerIds,
      },
    });
  };

  const deleteTeamMemberInGroup = (id) => {
    deleteTeamMember({
      handleSuccess: (v) => {
        fetchTeamMembers();
      },
      params: {
        teamMemberId: id,
      },
    });
  };

  const getSelectedTeam = () => {
    if (selectedTeam) {
      return teams.filter((t) => t.id === selectedTeam).pop();
    }

    return null;
  };

  const saveTeam = (data) => {
    if (getSelectedTeam) {
      updateTeam({
        handleSuccess: (v) => {
          fetchTeams(false);
        },
        params: {
          id: selectedTeam,
          ...data,
        },
      });
    }
  };

  const saveTeamMember = (id, position) => {
    if (getSelectedTeam) {
      updateTeamMember({
        handleSuccess: (v) => {
          fetchTeamMembers();
        },
        params: {
          id,
          position,
        },
      });
    }
  };

  const getTeamMemberInPosition = (position) => {
    if (!teamMembers) {
      return null;
    }

    return teamMembers.filter((tm) => tm.position === position).pop();
  };

  useEffect(() => {
    fetchTeams();
  }, []);

  useEffect(() => {
    if (props.assistantUser) {
      fetchTeams();
    }
  }, [props.assistantUser]);

  useEffect(() => {
    if (selectedTeam === null) {
      setTeamMembers(null);
    } else {
      fetchTeamMembers();
    }
  }, [selectedTeam]);

  if (!props.assistantUser) {
    return (
      <div className="d-flex h-100 justify-content-center align-items-center">
        <ButtonLogin
          flowUser={props.flowUser}
          assistantUser={props.assistantUser}
          logout={props.logout}
          content={<BoxLogin />}
        />
      </div>
    );
  }

  return (
    <div id="PageToolsTeamBuilder" className="h-100 w-100">
      <div className="container-xl h-100 px-2 px-md-4 py-4">
        <div className="d-flex flex-column flex-md-row h-100 w-100 fade-in">
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
                            setSelectedTeam(selectedTeam === t.id ? null : t.id)
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
                      onChange={(v) => saveTeam({ formation: v.target.value })}
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
                                    getTeamMemberInPosition(parseInt(p)).player
                                      .lastName
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
                                    style={{ textShadow: "black 0px 0px 1px" }}
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
                                        getTeamMemberInPosition(parseInt(p)).id,
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
                                        formations[getSelectedTeam().formation][
                                          p
                                        ].position
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
        </div>{" "}
      </div>{" "}
    </div>
  );
};

export default PageToolsTeamBuilder;