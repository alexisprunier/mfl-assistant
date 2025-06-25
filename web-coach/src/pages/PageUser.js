import BoxScrollUp from "components/box/BoxScrollUp.js";
import "./PageUser.css";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import {
  getUsers,
  getClubs,
  getOverallVsGdRates,
} from "services/api-assistant.js";
import { computeMatchRate } from "utils/rate.js";
import BoxCard from "components/box/BoxCard.js";
import BoxMessage from "components/box/BoxMessage.js";
import Count from "components/counts/Count.js";
import LoadingSquare from "components/loading/LoadingSquare.js";
import { getMatches } from "services/api-assistant.js";
import ItemRowMatch from "../components/items/ItemRowMatch";
import ControllerMatchType from "components/controllers/ControllerMatchType.js";
import ControllerClubs from "components/controllers/ControllerClubs.js";
import * as fcl from "@onflow/fcl";

interface PageUserProps {
  yScrollPosition: number;
  props: object;
}

const PageUser: React.FC<PageUserProps> = (props) => {
  const navigate = useNavigate();

  const { address } = useParams();
  const [user, setUser] = useState(null);
  const [clubs, setClubs] = useState(null);
  const [selectedClubIds, setSelectedClubIds] = useState([]);
  const [matches, setMatches] = useState(null);
  const [types, setTypes] = useState(["LEAGUE", "CUP"]);
  const [overallVsGdRates, setOverallVsGdRates] = useState(null);

  const fetchUser = () => {
    getUsers({
      handleSuccess: (d) => {
        if (d.data.getUsers && d.data.getUsers.length > 0) {
          setUser(d.data.getUsers[0]);
        }
      },
      handleError: (e) => console.log(e),
      params: { search: address },
    });
  };

  const fetchClubs = () => {
    getClubs({
      handleSuccess: (d) => {
        setClubs(d.data.getClubs.sort((a, b) => b.division - a.division));
      },
      handleError: (e) => console.log(e),
      params: { owners: [user.id] },
    });
  };

  const fetchOverallVsGdRates = () => {
    getOverallVsGdRates({
      handleSuccess: (d) => {
        setOverallVsGdRates(d.data.getOverallVsGdRates);
      },
      handleError: (e) => console.log(e),
      params: { engine: "10.1.1/6.0.2" },
    });
  };

  const fetchMatches = () => {
    setMatches(null);

    getMatches({
      handleSuccess: (d) => {
        setMatches(d.data.getMatches);
      },
      handleError: (e) => console.log(e),
      params: {
        limit: 20,
        clubs:
          selectedClubIds.length === 0
            ? clubs.map((c) => c.id)
            : selectedClubIds,
        statuses: ["LIVE", "ENDED"],
        types: types,
      },
    });
  };

  const computeAverageRate = (count) => {
    if (!Array.isArray(matches) || !Array.isArray(overallVsGdRates))
      return null;

    const availableCount = Math.min(count, matches.length);
    if (availableCount === 0) return null;

    const selectedMatches = matches.slice(0, availableCount);

    const rates = selectedMatches
      .map((m) =>
        computeMatchRate(
          m,
          overallVsGdRates,
          clubs.map((c) => c.id).includes(m.homeClub.id)
        )
      )
      .filter((rate) => typeof rate === "number");

    if (rates.length === 0) return null;

    const sum = rates.reduce((acc, rate) => acc + rate, 0);
    const avg = sum / rates.length;

    return Math.round(avg * 10) / 10;
  };

  const logOut = () => {
    fcl.unauthenticate();
    props.logout();
  };

  useEffect(() => {
    if (user) {
      fetchClubs();
    }
  }, [user]);

  useEffect(() => {
    if (clubs) {
      fetchMatches();
    }
  }, [clubs, types, selectedClubIds]);

  useEffect(() => {
    fetchOverallVsGdRates();

    if (address !== "me") {
      fetchUser();
    }
  }, []);

  useEffect(() => {
    if (address !== "me") {
      fetchUser();
    }
  }, [address]);

  useEffect(() => {
    if (address === "me" && props.assistantUser?.address) {
      navigate("/user/" + props.assistantUser.address);
    }
  }, [props.assistantUser]);

  return (
    <div id="PageUser" className="w-100 h-100">
      <nav className="TopBar navbar w-100 ps-md-5 px-4 py-2">
        <ul className="navbar-nav flex-row h6 ps-md-3">
          <li className="nav-item align-self-end lh-1 px-2 d-md-block d-none">
            <Link className={"nav-link nav-user border rounded-2 px-3"}>
              <i className="bi bi-person-fill me-1"></i>
              <span className="d-none d-md-inline ms-1">
                {user?.name ? user.name : <LoadingSquare />}
              </span>
            </Link>
          </li>

          {user?.address && props.assistantUser?.address === user?.address && (
            <li className="nav-item align-self-end lh-1 px-2">
              <Link onClick={logOut} className={"nav-link"}>
                <i className="bi bi-box-arrow-right text-danger mx-1"></i>
                <span className="d-none d-md-inline text-danger ms-1">
                  Log out
                </span>
              </Link>
            </li>
          )}
        </ul>
      </nav>

      <div className="d-flex w-100 h-100 justify-content-center">
        <div className="container-xl px-md-4 py-4">
          <div className="d-flex flex-column flex-md-row flex-fill">
            <div className="d-flex flex-column flex-md-basis-300">
              <BoxCard
                title={"Performance"}
                content={
                  <div className="d-flex flex-column flex-fill align-items-center">
                    <div className="d-flex mt-4 mb-3">
                      <Count
                        label={"Last 5 Matches"}
                        count={
                          matches && overallVsGdRates ? (
                            computeAverageRate(5)
                          ) : (
                            <LoadingSquare />
                          )
                        }
                      />
                    </div>
                    <div className="d-flex my-3 mb-4">
                      <Count
                        label={"Last 15 Matches"}
                        count={
                          matches && overallVsGdRates ? (
                            computeAverageRate(15)
                          ) : (
                            <LoadingSquare />
                          )
                        }
                      />
                    </div>
                  </div>
                }
              />

              <BoxCard
                title={"HQ with Assistant"}
                content={
                  <div className="d-flex flex-column flex-fill">
                    <div className="text-center mt-1 mb-2">
                      <img
                        style={{
                          width: "60%",
                          maxWidth: "100%",
                        }}
                        src="/media/images/assistant.png"
                        alt="MFL Assistant"
                      />
                    </div>

                    <div className="text-end">
                      <button
                        className="btn btn-info text-white"
                        onClick={() =>
                          window.open(
                            "https://mfl-assistant.com/user/" +
                              props.assistantUser.address
                          )
                        }
                      >
                        Go to clubs, players, map...{" "}
                        <i class="bi bi-caret-right-fill text-white"></i>
                      </button>
                    </div>
                  </div>
                }
              />
            </div>

            <div className="d-flex flex-column flex-fill">
              <BoxCard
                title={"Matches"}
                actions={
                  <div className="d-flex h-100 align-items-center">
                    <ControllerMatchType
                      selectedCriteria={types}
                      onChange={(t) => setTypes(t)}
                    />
                  </div>
                }
                content={
                  <div className="d-flex flex-column flex-fill mt-1">
                    <div className="d-flex flex-fill justify-content-end mb-2">
                      {clubs ? (
                        <ControllerClubs
                          clubs={clubs}
                          selectedClubs={selectedClubIds}
                          onChange={(t) => setSelectedClubIds(t)}
                        />
                      ) : (
                        <div style={{ height: 25, width: 150 }}>
                          <LoadingSquare />
                        </div>
                      )}
                    </div>

                    {overallVsGdRates && matches ? (
                      matches.length > 0 ? (
                        <div className="d-flex flex-column flex-fill">
                          {matches.map((m) => (
                            <ItemRowMatch
                              match={m}
                              rate={computeMatchRate(
                                m,
                                overallVsGdRates,
                                clubs.map((c) => c.id).includes(m.homeClub.id)
                              )}
                            />
                          ))}
                        </div>
                      ) : (
                        <BoxMessage
                          className={"py-md-4"}
                          content={"No match found"}
                        />
                      )
                    ) : (
                      <div
                        className="d-flex flex-fill w-100"
                        style={{ height: 200 }}
                      >
                        <LoadingSquare />
                      </div>
                    )}
                  </div>
                }
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PageUser;
