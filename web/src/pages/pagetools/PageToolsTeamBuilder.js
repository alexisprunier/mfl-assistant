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

const PageToolsTeamBuilder: React.FC<PageToolsTeamBuilderProps> = (props) => {
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
          content={<BoxLogin assistantUser={props.assistantUser} />}
        />
      </div>
    );
  }

  return (
    <div id="PageToolsMatchObservatory" className="h-100 w-100">
      <div className="d-flex h-100 w-100 justify-content-center align-items-center">
        <div className="card d-flex flex-column p-3 pt-2 mx-1">
          <h4>Coach is now in charge!</h4>

          <div className="d-flex flex-column flex-md-row">
            <div className="d-flex flex-fill justify-content-center">
              <img
                style={{ width: "120px", height: "120px" }}
                src="/media/images/coach.png"
                alt="MFL Assistant"
              />
            </div>

            <div className="d-flex flex-column flex-fill align-items-center justify-content-center px-2">
              <div className="py-3">
                <b>The Team Builder</b>
                <br />
                has been renamed to Squad Builder
                <br />
                and is now managed by the MFL Coach.
              </div>

              <div>
                <button
                  className="d-flex flex-row btn btn-info text-white me-1"
                  style={{ backgroundColor: "#f86285", borderColor: "#f86285" }}
                  onClick={() =>
                    window.open("https://mfl-coach.com/squad-builder")
                  }
                >
                  Visit Coach!
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PageToolsTeamBuilder;
