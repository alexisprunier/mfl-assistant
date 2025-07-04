import { NotificationManager as nm } from "react-notifications";
import { get, post, loginPost } from "utils/request.js";
import { getApiEndpoint, getGraphQLEndpoint } from "utils/env.js";
import { jsonToParams } from "utils/graphql.js";

const defaultHandleSuccess = (h, v) => {
  if (h) {
    h(v);
  }
};

const defaultHandleError = (h, e) => {
  if (h) {
    h(e);
  } else {
    nm.warning("An error happened while requesting the API");
  }
};

/* login */

export const login = ({ handleSuccess = null, handleError = null, body }) =>
  loginPost(
    getApiEndpoint() + "api/login",
    body,
    (v) => defaultHandleSuccess(handleSuccess, v),
    (e) => defaultHandleError(handleError, e),
    true
  );

export const logout = ({ handleSuccess = null, handleError = null }) =>
  loginPost(
    getApiEndpoint() + "api/logout",
    null,
    (v) => defaultHandleSuccess(handleSuccess, v),
    (e) => defaultHandleError(handleError, e),
    true
  );

/* NONCE */

export const getGenerateNonce = ({
  handleSuccess = null,
  handleError = null,
}) =>
  get(
    getApiEndpoint() + "api/generate_nonce",
    (v) => defaultHandleSuccess(handleSuccess, v),
    (e) => defaultHandleError(handleError, e)
  );

/* GRAPHQL */

/* User */

export const getLoggedUser = ({ handleSuccess = null, handleError = null }) =>
  post(
    getGraphQLEndpoint(),
    JSON.stringify({
      query: `
      {
        getLoggedUser {
          id,
          address,
          email,
          isEmailConfirmed
        }
      }
    `,
    }),
    (v) => defaultHandleSuccess(handleSuccess, v),
    (e) => defaultHandleError(handleError, e)
  );

export const updateLoggedUserEmail = ({
  handleSuccess = null,
  handleError = null,
  params,
}) =>
  post(
    getGraphQLEndpoint(),
    JSON.stringify({
      query: `
      mutation {
        updateLoggedUserEmail(email: "${params.email}") {
          user {
            address,
            email
          }
        }
      }
    `,
    }),
    (v) => defaultHandleSuccess(handleSuccess, v),
    (e) => defaultHandleError(handleError, e)
  );

export const sendConfirmationMail = ({
  handleSuccess = null,
  handleError = null,
  params,
}) =>
  post(
    getGraphQLEndpoint(),
    JSON.stringify({
      query: `
      mutation {
        sendConfirmationMail(address: "${params.address}", email: "${params.email}") {
          user {
            address,
            email
          }
        }
      }
    `,
    }),
    (v) => defaultHandleSuccess(handleSuccess, v),
    (e) => defaultHandleError(handleError, e)
  );

/* Notification */

export const getNotificationScopesAndNotifications = ({
  handleSuccess = null,
  handleError = null,
}) =>
  post(
    getGraphQLEndpoint(),
    JSON.stringify({
      query: `{
        getNotificationScopes {
          id,
          type,
          positions,
          primaryPositionOnly,
          nationalities,
          minPrice,
          maxPrice,
          minAge,
          maxAge,
          minOvr,
          maxOvr,
          minPac,
          maxPac,
          minDri,
          maxDri,
          minPas,
          maxPas,
          minSho,
          maxSho,
          minDef,
          maxDef,
          minPhy,
          maxPhy
        },
        getNotifications(order: -1) {
          id,
          status,
          playerIds,
          creationDate,
          sendingDate,
          notificationScope {
            id
          }
        }
      }`,
    }),
    (v) => defaultHandleSuccess(handleSuccess, v),
    (e) => defaultHandleError(handleError, e)
  );

export const getNotificationsOfNotificationScope = ({
  handleSuccess = null,
  handleError = null,
  params,
}) =>
  post(
    getGraphQLEndpoint(),
    JSON.stringify({
      query: `{
        getNotifications(${jsonToParams(params)}) {
          id,
          status,
          playerIds,
          creationDate,
          sendingDate,
          notificationScope {
            id
          }
        }
      }`,
    }),
    (v) => defaultHandleSuccess(handleSuccess, v),
    (e) => defaultHandleError(handleError, e)
  );

export const addNotificationScope = ({
  handleSuccess = null,
  handleError = null,
  params,
}) =>
  post(
    getGraphQLEndpoint(),
    JSON.stringify({
      query: `
      mutation {
        addNotificationScope(${jsonToParams(params)}) {
          notificationScope {
            id,
            type
          }
        }
      }
    `,
    }),
    (v) => defaultHandleSuccess(handleSuccess, v),
    (e) => defaultHandleError(handleError, e)
  );

export const deleteNotificationScope = ({
  handleSuccess = null,
  handleError = null,
  params,
}) =>
  post(
    getGraphQLEndpoint(),
    JSON.stringify({
      query: `
      mutation {
        deleteNotificationScope(${jsonToParams(params)}) {
          notificationScope {
            id
          }
        }
      }
    `,
    }),
    (v) => defaultHandleSuccess(handleSuccess, v),
    (e) => defaultHandleError(handleError, e)
  );

/* Report */

export const getReportConfigurations = ({
  handleSuccess = null,
  handleError = null,
}) =>
  post(
    getGraphQLEndpoint(),
    JSON.stringify({
      query: `{
        getReportConfigurations {
          id,
          type,
          time
        }
      }`,
    }),
    (v) => defaultHandleSuccess(handleSuccess, v),
    (e) => defaultHandleError(handleError, e)
  );

export const addReportConfiguration = ({
  handleSuccess = null,
  handleError = null,
  params,
}) =>
  post(
    getGraphQLEndpoint(),
    JSON.stringify({
      query: `
      mutation {
        addReportConfiguration(${jsonToParams(params)}) {
          reportConfiguration {
            id,
            type,
            time
          }
        }
      }
    `,
    }),
    (v) => defaultHandleSuccess(handleSuccess, v),
    (e) => defaultHandleError(handleError, e)
  );

export const updateReportConfiguration = ({
  handleSuccess = null,
  handleError = null,
  params,
}) =>
  post(
    getGraphQLEndpoint(),
    JSON.stringify({
      query: `
      mutation {
        updateReportConfiguration(${jsonToParams(params)}) {
          status
        }
      }
    `,
    }),
    (v) => defaultHandleSuccess(handleSuccess, v),
    (e) => defaultHandleError(handleError, e)
  );

export const deleteReportConfiguration = ({
  handleSuccess = null,
  handleError = null,
  params,
}) =>
  post(
    getGraphQLEndpoint(),
    JSON.stringify({
      query: `
      mutation {
        deleteReportConfiguration(${jsonToParams(params)}) {
          status
        }
      }
    `,
    }),
    (v) => defaultHandleSuccess(handleSuccess, v),
    (e) => defaultHandleError(handleError, e)
  );

/* Clubs */

export const getClubs = ({
  handleSuccess = null,
  handleError = null,
  params,
}) =>
  post(
    getGraphQLEndpoint(),
    JSON.stringify({
      query: `{
        getClubs(${jsonToParams(params)}) {
          id,
          status,
          name,
          division,
          city,
          country,
          geolocation {
            city,
            country,
            latitude,
            longitude
          }
        }
      }`,
    }),
    (v) => defaultHandleSuccess(handleSuccess, v),
    (e) => defaultHandleError(handleError, e)
  );

export const getClubData = ({ handleSuccess = null, handleError = null }) =>
  post(
    getGraphQLEndpoint(),
    JSON.stringify({
      query: `{
        getClubCount,
        getAllClubCount: getClubCount(foundedOnly: false),
        getClubOwnerCount,
        getClubsPerOwnerCounts {
          key,
          count
        },
        getAllClubsPerOwnerCounts: getClubsPerOwnerCounts(foundedOnly: false) {
          key,
          count
        },
        getClubDivisionCounts {
          key,
          count
        },
        getAllClubDivisionCounts: getClubDivisionCounts(foundedOnly: false) {
          key,
          count
        },
        getDataPoints(property: "founded_club_count") {
          date,
          value
        }
      }`,
    }),
    (v) => defaultHandleSuccess(handleSuccess, v),
    (e) => defaultHandleError(handleError, e)
  );

export const getMarketplaceData = ({
  handleSuccess = null,
  handleError = null,
  params,
}) =>
  post(
    getGraphQLEndpoint(),
    JSON.stringify({
      query: `{
        getPlayerSaleTotal: getDataPoints(property: "${params.playerSaleTotalProperty}") {
          date,
          value
        },
        getClubSales: getSales(type: "CLUB", limit: 100000) {
          executionDate,
          price,
          club {
            status,
            name,
            division,
            city,
            country,
            foundationDate
          }
        }
      }`,
    }),
    (v) => defaultHandleSuccess(handleSuccess, v),
    (e) => defaultHandleError(handleError, e)
  );

export const getPlayerDashboardData = ({
  handleSuccess = null,
  handleError = null,
  params,
}) =>
  post(
    getGraphQLEndpoint(),
    JSON.stringify({
      query: `{
        getPlayerCount(${jsonToParams(params)}),
        getPlayerOwnerCount,
        NAT: getPlayerCountByCriteria(criteria: "NAT", ${jsonToParams(
          params
        )}) {
          key,
          count
        },
        AGE: getPlayerCountByCriteria(criteria: "AGE", ${jsonToParams(
          params
        )}) {
          key,
          count
        },
        OVR: getPlayerCountByCriteria(criteria: "OVR", ${jsonToParams(
          params
        )}) {
          key,
          count
        },
        POS: getPlayerCountByCriteria(criteria: "POS", ${jsonToParams(
          params
        )}) {
          key,
          count
        },
        FOOT: getPlayerCountByCriteria(criteria: "FOOT", ${jsonToParams(
          params
        )}) {
          key,
          count
        },
        HEI: getPlayerCountByCriteria(criteria: "HEI", ${jsonToParams(
          params
        )}) {
          key,
          count
        },
        PAC: getPlayerCountByCriteria(criteria: "PAC", ${jsonToParams(
          params
        )}) {
          key,
          count
        },
        DRI: getPlayerCountByCriteria(criteria: "DRI", ${jsonToParams(
          params
        )}) {
          key,
          count
        },
        PAS: getPlayerCountByCriteria(criteria: "PAS", ${jsonToParams(
          params
        )}) {
          key,
          count
        },
        SHO: getPlayerCountByCriteria(criteria: "SHO", ${jsonToParams(
          params
        )}) {
          key,
          count
        },
        DEF: getPlayerCountByCriteria(criteria: "DEF", ${jsonToParams(
          params
        )}) {
          key,
          count
        },
        PHY: getPlayerCountByCriteria(criteria: "PHY", ${jsonToParams(
          params
        )}) {
          key,
          count
        }
      }`,
    }),
    (v) => defaultHandleSuccess(handleSuccess, v),
    (e) => defaultHandleError(handleError, e)
  );

export const getPlayerCountPerCountry = ({
  handleSuccess = null,
  handleError = null,
  params,
}) =>
  post(
    getGraphQLEndpoint(),
    JSON.stringify({
      query: `{
          getPlayerCountPerCountry(${jsonToParams(params)}) {
            key,
            count
          },
        }`,
    }),
    (v) => defaultHandleSuccess(handleSuccess, v),
    (e) => defaultHandleError(handleError, e)
  );

export const getClubCountPerGeolocation = ({
  handleSuccess = null,
  handleError = null,
  params,
}) =>
  post(
    getGraphQLEndpoint(),
    JSON.stringify({
      query: `{
          getClubCountPerGeolocation(${jsonToParams(params)}) {
            count,
            geolocation {
              country,
              city,
              latitude,
              longitude
            }
          },
        }`,
    }),
    (v) => defaultHandleSuccess(handleSuccess, v),
    (e) => defaultHandleError(handleError, e)
  );

export const getUserCountPerGeolocation = ({
  handleSuccess = null,
  handleError = null,
  params,
}) =>
  post(
    getGraphQLEndpoint(),
    JSON.stringify({
      query: `{
          getUserCountPerGeolocation(${jsonToParams(params)}) {
            count,
            geolocation {
              country,
              city,
              latitude,
              longitude
            }
          },
        }`,
    }),
    (v) => defaultHandleSuccess(handleSuccess, v),
    (e) => defaultHandleError(handleError, e)
  );

export const getTeams = ({ handleSuccess = null, handleError = null }) =>
  post(
    getGraphQLEndpoint(),
    JSON.stringify({
      query: `{
        getTeams {
          id,
          name,
          formation,
          isPublic,
          teamMembers {
            id,
            player {
              id,
              firstName,
              lastName,
              age,
              height,
              overall,
              nationalities,
              positions,
              pace,
              shooting,
              dribbling,
              passing,
              defense,
              physical,
              goalkeeping,
              resistance,
              owner {
                id,
                name
              }
            },
            position
          }
        }
      }`,
    }),
    (v) => defaultHandleSuccess(handleSuccess, v),
    (e) => defaultHandleError(handleError, e)
  );

export const getTeamMembers = ({
  handleSuccess = null,
  handleError = null,
  params,
}) =>
  post(
    getGraphQLEndpoint(),
    JSON.stringify({
      query: `{
        getTeamMembers(${jsonToParams(params)}) {
          id,
          team {
            id
          },
          player {
            id,
            firstName,
            lastName,
            age,
            height,
            overall,
            nationalities,
            positions,
            pace,
            shooting,
            dribbling,
            passing,
            defense,
            physical,
            goalkeeping,
            resistance
          },
          position
        }
      }`,
    }),
    (v) => defaultHandleSuccess(handleSuccess, v),
    (e) => defaultHandleError(handleError, e)
  );

export const addTeam = ({ handleSuccess = null, handleError = null, params }) =>
  post(
    getGraphQLEndpoint(),
    JSON.stringify({
      query: `
      mutation {
        addTeam(${jsonToParams(params)}) {
          team {
            id,
            name,
            formation,
            isPublic
          }
        }
      }
    `,
    }),
    (v) => defaultHandleSuccess(handleSuccess, v),
    (e) => defaultHandleError(handleError, e)
  );

export const updateTeam = ({
  handleSuccess = null,
  handleError = null,
  params,
}) =>
  post(
    getGraphQLEndpoint(),
    JSON.stringify({
      query: `
      mutation {
        updateTeam(${jsonToParams(params)}) {
          status
        }
      }
    `,
    }),
    (v) => defaultHandleSuccess(handleSuccess, v),
    (e) => defaultHandleError(handleError, e)
  );

export const deleteTeam = ({
  handleSuccess = null,
  handleError = null,
  params,
}) =>
  post(
    getGraphQLEndpoint(),
    JSON.stringify({
      query: `
      mutation {
        deleteTeam(${jsonToParams(params)}) {
          status
        }
      }
    `,
    }),
    (v) => defaultHandleSuccess(handleSuccess, v),
    (e) => defaultHandleError(handleError, e)
  );

export const addTeamMembers = ({
  handleSuccess = null,
  handleError = null,
  params,
}) =>
  post(
    getGraphQLEndpoint(),
    JSON.stringify({
      query: `
      mutation {
        addTeamMembers(${jsonToParams(params)}) {
          teamMembers {
            team { id },
            player { id },
            position
          }
        }
      }
    `,
    }),
    (v) => defaultHandleSuccess(handleSuccess, v),
    (e) => defaultHandleError(handleError, e)
  );

export const updateTeamMember = ({
  handleSuccess = null,
  handleError = null,
  params,
}) =>
  post(
    getGraphQLEndpoint(),
    JSON.stringify({
      query: `
      mutation {
        updateTeamMember(${jsonToParams(params)}) {
          status
        }
      }
    `,
    }),
    (v) => defaultHandleSuccess(handleSuccess, v),
    (e) => defaultHandleError(handleError, e)
  );

export const deleteTeamMember = ({
  handleSuccess = null,
  handleError = null,
  params,
}) =>
  post(
    getGraphQLEndpoint(),
    JSON.stringify({
      query: `
      mutation {
        deleteTeamMember(${jsonToParams(params)}) {
          status
        }
      }
    `,
    }),
    (v) => defaultHandleSuccess(handleSuccess, v),
    (e) => defaultHandleError(handleError, e)
  );

export const getPlayerNationalities = ({
  handleSuccess = null,
  handleError = null,
}) =>
  post(
    getGraphQLEndpoint(),
    JSON.stringify({
      query: `{
        getPlayerNationalities
      }`,
    }),
    (v) => defaultHandleSuccess(handleSuccess, v),
    (e) => defaultHandleError(handleError, e)
  );

export const getPlayers = ({
  handleSuccess = null,
  handleError = null,
  params,
}) =>
  post(
    getGraphQLEndpoint(),
    JSON.stringify({
      query: `{
        getPlayers(${jsonToParams(params)}) {
          id,
          firstName,
          lastName,
          age,
          overall,
          nationalities,
          positions,
          pace,
          shooting,
          dribbling,
          passing,
          defense,
          physical,
          goalkeeping,
          resistance
        }
      }`,
    }),
    (v) => defaultHandleSuccess(handleSuccess, v),
    (e) => defaultHandleError(handleError, e)
  );

export const getUsers = ({
  handleSuccess = null,
  handleError = null,
  params,
}) =>
  post(
    getGraphQLEndpoint(),
    JSON.stringify({
      query: `{
        getUsers(${jsonToParams(params)}) {
          id,
          address,
          name,
          country,
          city,
          geolocation {
            country,
            city,
            latitude,
            longitude
          }
        }
      }`,
    }),
    (v) => defaultHandleSuccess(handleSuccess, v),
    (e) => defaultHandleError(handleError, e)
  );

export const getContracts = ({
  handleSuccess = null,
  handleError = null,
  params,
}) =>
  post(
    getGraphQLEndpoint(),
    JSON.stringify({
      query: `{
        getContracts(${jsonToParams(params)}) {
          id,
          status,
          revenueShare,
          totalRevenueShareLocked,
          startSeason,
          numberOfSeason,
          autoRenewal,
          creationDate,
          club {
            id,
            name,
            status,
            division,
            city,
            country,
            foundationDate
          },
          player {
            id,
            firstName,
            lastName,
            overall,
            nationalities,
            positions,
            pace,
            shooting,
            dribbling,
            passing,
            defense,
            physical,
            goalkeeping,
            resistance
          }
        }
      }`,
    }),
    (v) => defaultHandleSuccess(handleSuccess, v),
    (e) => defaultHandleError(handleError, e)
  );

export const getPlayerSales = ({
  handleSuccess = null,
  handleError = null,
  params,
}) =>
  post(
    getGraphQLEndpoint(),
    JSON.stringify({
      query: `{
        getPlayerSales: getSales(${jsonToParams(params)}) {
          executionDate,
          price,
          age,
          overall,
          positions,
          player {
            id,
            firstName,
            lastName,
            age,
            overall,
            nationalities,
            positions,
            pace,
            shooting,
            dribbling,
            passing,
            defense,
            physical,
            goalkeeping,
            resistance
          }
        }
      }`,
    }),
    (v) => defaultHandleSuccess(handleSuccess, v),
    (e) => defaultHandleError(handleError, e)
  );

export const getPlayerPricings = ({
  handleSuccess = null,
  handleError = null,
}) =>
  post(
    getGraphQLEndpoint(),
    JSON.stringify({
      query: `{
        getPlayerPricings {
          overall,
          age,
          price,
          position
        }
      }`,
    }),
    (v) => defaultHandleSuccess(handleSuccess, v),
    (e) => defaultHandleError(handleError, e)
  );

export const getRawPlayerPricings = ({
  handleSuccess = null,
  handleError = null,
}) =>
  post(
    getGraphQLEndpoint(),
    JSON.stringify({
      query: `{
        getRawPlayerPricings {
          overall,
          age,
          price,
          position,
          date
        }
      }`,
    }),
    (v) => defaultHandleSuccess(handleSuccess, v),
    (e) => defaultHandleError(handleError, e)
  );

export const getFormationMetaEngines = ({
  handleSuccess = null,
  handleError = null,
}) =>
  post(
    getGraphQLEndpoint(),
    JSON.stringify({
      query: `{
          getFormationMetaEngines
        }`,
    }),
    (v) => defaultHandleSuccess(handleSuccess, v),
    (e) => defaultHandleError(handleError, e)
  );

export const getFormationMetas = ({
  handleSuccess = null,
  handleError = null,
  params,
}) =>
  post(
    getGraphQLEndpoint(),
    JSON.stringify({
      query: `{
          getFormationMetas(${jsonToParams(params)}) {
            formation1,
            formation2,
            victories,
            draws,
            defeats,
            engine
          }
        }`,
    }),
    (v) => defaultHandleSuccess(handleSuccess, v),
    (e) => defaultHandleError(handleError, e)
  );

export const getFormations = ({ handleSuccess = null, handleError = null }) =>
  post(
    getGraphQLEndpoint(),
    JSON.stringify({
      query: `{
        getFormations
      }`,
    }),
    (v) => defaultHandleSuccess(handleSuccess, v),
    (e) => defaultHandleError(handleError, e)
  );

export const getOpponents = ({
  handleSuccess = null,
  handleError = null,
  params,
}) =>
  post(
    getGraphQLEndpoint(),
    JSON.stringify({
      query: `{
          getOpponents(${jsonToParams(params)}) {
            id,
            startDate,
            status,
            type,
            homeScore,
            awayScore,
            homeFormation,
            awayFormation,
            homePositions {
              index,
              player
            },
            awayPositions {
              index,
              player
            },
            modifiers {
              target {
                type,
                ids
              },
              values {
                type,
                value,
                field
              }
            },
            players,
            homeClub {
              id,
              name
            },
            awayClub {
              id,
              name
            }
          }
        }`,
    }),
    (v) => defaultHandleSuccess(handleSuccess, v),
    (e) => defaultHandleError(handleError, e)
  );

export const getMatches = ({
  handleSuccess = null,
  handleError = null,
  params,
}) =>
  post(
    getGraphQLEndpoint(),
    JSON.stringify({
      query: `{
          getMatches(${jsonToParams(params)}) {
            id,
            startDate,
            status,
            type,
            homeScore,
            awayScore,
            homeFormation,
            awayFormation,
            homeOverall,
            awayOverall,
            homePositions {
              index,
              player
            },
            awayPositions {
              index,
              player
            },
            modifiers {
              target {
                type,
                ids
              },
              values {
                type,
                value,
                field
              }
            },
            players,
            homeClub {
              id,
              name
            },
            awayClub {
              id,
              name
            }
          }
        }`,
    }),
    (v) => defaultHandleSuccess(handleSuccess, v),
    (e) => defaultHandleError(handleError, e)
  );

export const getPlayerPricingHistory = ({
  handleSuccess = null,
  handleError = null,
  params,
}) =>
  post(
    getGraphQLEndpoint(),
    JSON.stringify({
      query: `{
        getPlayerPricingHistory(${jsonToParams(params)}) {
          overall,
          age,
          price,
          position,
          date
        }
      }`,
    }),
    (v) => defaultHandleSuccess(handleSuccess, v),
    (e) => defaultHandleError(handleError, e)
  );

export const getOverallVsGdRates = ({
  handleSuccess = null,
  handleError = null,
  params,
}) =>
  post(
    getGraphQLEndpoint(),
    JSON.stringify({
      query: `{
        getOverallVsGdRates(${jsonToParams(params)}) {
          overallDifference,
          goalDifference,
          rate,
          engine
        }
      }`,
    }),
    (v) => defaultHandleSuccess(handleSuccess, v),
    (e) => defaultHandleError(handleError, e)
  );
