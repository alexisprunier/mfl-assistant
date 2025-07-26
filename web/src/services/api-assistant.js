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

export const getGenerateNonce = ({ handleSuccess = null, handleError = null }) =>
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

export const updateLoggedUserEmail = ({ handleSuccess = null, handleError = null, params }) =>
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

export const sendConfirmationMail = ({ handleSuccess = null, handleError = null, params }) =>
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

export const getNotificationScopesAndNotifications = ({ handleSuccess = null, handleError = null }) =>
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
        getNotifications(order: -1, type: "player") {
          id,
          status,
          playerIds,
          clubIds,
          creationDate,
          sendingDate,
          notificationScope {
            id
          },
          clubNotificationScope {
            id
          }
        }
      }`,
    }),
    (v) => defaultHandleSuccess(handleSuccess, v),
    (e) => defaultHandleError(handleError, e)
  );

export const getNotificationsOfNotificationScope = ({ handleSuccess = null, handleError = null, params }) =>
  post(
    getGraphQLEndpoint(),
    JSON.stringify({
      query: `{
        getNotifications(${jsonToParams(params)}) {
          id,
          status,
          playerIds,
          clubIds,
          creationDate,
          sendingDate,
          notificationScope {
            id
          },
          clubNotificationScope {
            id
          }
        }
      }`,
    }),
    (v) => defaultHandleSuccess(handleSuccess, v),
    (e) => defaultHandleError(handleError, e)
  );

export const addNotificationScope = ({ handleSuccess = null, handleError = null, params }) =>
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

export const deleteNotificationScope = ({ handleSuccess = null, handleError = null, params }) =>
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

export const getClubNotificationScopesAndNotifications = ({ handleSuccess = null, handleError = null }) =>
  post(
    getGraphQLEndpoint(),
    JSON.stringify({
      query: `{
        getClubNotificationScopes {
          id,
          type,
          minPrice,
          maxPrice,
          countries,
          cities,
          divisions
        },
        getNotifications(order: -1, type: "club") {
          id,
          status,
          playerIds,
          creationDate,
          sendingDate,
          clubNotificationScope {
            id
          }
        }
      }`,
    }),
    (v) => defaultHandleSuccess(handleSuccess, v),
    (e) => defaultHandleError(handleError, e)
  );

export const getNotificationsOfClubNotificationScope = ({ handleSuccess = null, handleError = null, params }) =>
  post(
    getGraphQLEndpoint(),
    JSON.stringify({
      query: `{
        getNotifications(${jsonToParams(params)}) {
          id,
          status,
          playerIds,
          clubIds,
          creationDate,
          sendingDate,
          clubNotificationScope {
            id
          }
        }
      }`,
    }),
    (v) => defaultHandleSuccess(handleSuccess, v),
    (e) => defaultHandleError(handleError, e)
  );

export const addClubNotificationScope = ({ handleSuccess = null, handleError = null, params }) =>
  post(
    getGraphQLEndpoint(),
    JSON.stringify({
      query: `
      mutation {
        addClubNotificationScope(${jsonToParams(params)}) {
          clubNotificationScope {
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

export const deleteClubNotificationScope = ({ handleSuccess = null, handleError = null, params }) =>
  post(
    getGraphQLEndpoint(),
    JSON.stringify({
      query: `
      mutation {
        deleteClubNotificationScope(${jsonToParams(params)}) {
          clubNotificationScope {
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

export const getReportConfigurations = ({ handleSuccess = null, handleError = null }) =>
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

export const addReportConfiguration = ({ handleSuccess = null, handleError = null, params }) =>
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

export const updateReportConfiguration = ({ handleSuccess = null, handleError = null, params }) =>
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

export const deleteReportConfiguration = ({ handleSuccess = null, handleError = null, params }) =>
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

export const getClubs = ({ handleSuccess = null, handleError = null, params }) =>
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
        getClubCount(foundedOnly: true),
        getAllClubCount: getClubCount(foundedOnly: false),
        getClubOwnerCount,
        getClubsPerOwnerCounts(foundedOnly: true) {
          key,
          count
        },
        getAllClubsPerOwnerCounts: getClubsPerOwnerCounts(foundedOnly: false) {
          key,
          count
        },
        getClubDivisionCounts(foundedOnly: true) {
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

export const getUserData = ({ handleSuccess = null, handleError = null }) =>
  post(
    getGraphQLEndpoint(),
    JSON.stringify({
      query: `{
        getClubUserData: getDataPoints(property: "club_owner_count") {
          date,
          value
        }
        getPlayerUserData: getDataPoints(property: "player_owner_count") {
          date,
          value
        }
      }`,
    }),
    (v) => defaultHandleSuccess(handleSuccess, v),
    (e) => defaultHandleError(handleError, e)
  );

export const getMarketplaceData = ({ handleSuccess = null, handleError = null, params }) =>
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

export const getPlayerDashboardData = ({ handleSuccess = null, handleError = null, params }) =>
  post(
    getGraphQLEndpoint(),
    JSON.stringify({
      query: `{
        getPlayerCount(${jsonToParams(params)}),
        getPlayerOwnerCount,
        NAT: getPlayerCountByCriteria(criteria: "NAT", ${jsonToParams(params)}) {
          key,
          count
        },
        AGE: getPlayerCountByCriteria(criteria: "AGE", ${jsonToParams(params)}) {
          key,
          count
        },
        OVR: getPlayerCountByCriteria(criteria: "OVR", ${jsonToParams(params)}) {
          key,
          count
        },
        POS: getPlayerCountByCriteria(criteria: "POS", ${jsonToParams(params)}) {
          key,
          count
        },
        FOOT: getPlayerCountByCriteria(criteria: "FOOT", ${jsonToParams(params)}) {
          key,
          count
        },
        HEI: getPlayerCountByCriteria(criteria: "HEI", ${jsonToParams(params)}) {
          key,
          count
        },
        PAC: getPlayerCountByCriteria(criteria: "PAC", ${jsonToParams(params)}) {
          key,
          count
        },
        DRI: getPlayerCountByCriteria(criteria: "DRI", ${jsonToParams(params)}) {
          key,
          count
        },
        PAS: getPlayerCountByCriteria(criteria: "PAS", ${jsonToParams(params)}) {
          key,
          count
        },
        SHO: getPlayerCountByCriteria(criteria: "SHO", ${jsonToParams(params)}) {
          key,
          count
        },
        DEF: getPlayerCountByCriteria(criteria: "DEF", ${jsonToParams(params)}) {
          key,
          count
        },
        PHY: getPlayerCountByCriteria(criteria: "PHY", ${jsonToParams(params)}) {
          key,
          count
        }
      }`,
    }),
    (v) => defaultHandleSuccess(handleSuccess, v),
    (e) => defaultHandleError(handleError, e)
  );

export const getPlayerCountPerCountry = ({ handleSuccess = null, handleError = null, params }) =>
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

export const getClubCountPerGeolocation = ({ handleSuccess = null, handleError = null, params }) =>
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

export const getUserCountPerGeolocation = ({ handleSuccess = null, handleError = null, params }) =>
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
          isPublic
        }
      }`,
    }),
    (v) => defaultHandleSuccess(handleSuccess, v),
    (e) => defaultHandleError(handleError, e)
  );

export const getTeamMembers = ({ handleSuccess = null, handleError = null, params }) =>
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

export const updateTeam = ({ handleSuccess = null, handleError = null, params }) =>
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

export const deleteTeam = ({ handleSuccess = null, handleError = null, params }) =>
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

export const addTeamMembers = ({ handleSuccess = null, handleError = null, params }) =>
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

export const updateTeamMember = ({ handleSuccess = null, handleError = null, params }) =>
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

export const deleteTeamMember = ({ handleSuccess = null, handleError = null, params }) =>
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

export const getPlayerNationalities = ({ handleSuccess = null, handleError = null }) =>
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

export const getClubCountriesAndCities = ({ handleSuccess = null, handleError = null }) =>
  post(
    getGraphQLEndpoint(),
    JSON.stringify({
      query: `{
        getClubCountries,
        getClubCities
      }`,
    }),
    (v) => defaultHandleSuccess(handleSuccess, v),
    (e) => defaultHandleError(handleError, e)
  );

export const getPlayers = ({ handleSuccess = null, handleError = null, params }) =>
  post(
    getGraphQLEndpoint(),
    JSON.stringify({
      query: `{
        getPlayers(${jsonToParams(params)}) {
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
        }
      }`,
    }),
    (v) => defaultHandleSuccess(handleSuccess, v),
    (e) => defaultHandleError(handleError, e)
  );

export const getUsers = ({ handleSuccess = null, handleError = null, params }) =>
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

export const getContracts = ({ handleSuccess = null, handleError = null, params }) =>
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
          }
        }
      }`,
    }),
    (v) => defaultHandleSuccess(handleSuccess, v),
    (e) => defaultHandleError(handleError, e)
  );

export const getPlayerSales = ({ handleSuccess = null, handleError = null, params }) =>
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
          }
        }
      }`,
    }),
    (v) => defaultHandleSuccess(handleSuccess, v),
    (e) => defaultHandleError(handleError, e)
  );

export const getPlayerPricingHistory = ({ handleSuccess = null, handleError = null, params }) =>
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

export const getPlayerPricings = ({ handleSuccess = null, handleError = null }) =>
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

export const getRawPlayerPricings = ({ handleSuccess = null, handleError = null }) =>
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
