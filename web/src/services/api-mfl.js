import { get } from "utils/request.js";
import { getMflApiEndpoint } from "utils/env.js";
import { convertDictToUrlParams } from "utils/url.js";

/* COMPETITIONS */

export const getPastCompetitions = (handleSuccess, handleError) =>
  get(
    getMflApiEndpoint() + "competitions?past=true",
    handleSuccess,
    handleError
  );

export const getUpcomingCompetitions = (handleSuccess, handleError) =>
  get(
    getMflApiEndpoint() + "competitions?upcoming=true",
    handleSuccess,
    handleError
  );

/* PLAYERS */

export const getPlayers = (handleSuccess, handleError, params) =>
  get(
    getMflApiEndpoint() +
      "players?limit=400&withCount=true&" +
      convertDictToUrlParams(params),
    handleSuccess,
    handleError
  );

export const getPlayerCount = (handleSuccess, handleError, params) =>
  get(
    getMflApiEndpoint() +
      "players?limit=1&withCount=true&excludingMflOwned=true&" +
      convertDictToUrlParams(params),
    handleSuccess,
    handleError
  );

export const getUnderContractPlayers = (handleSuccess, handleError, params) =>
  get(
    getMflApiEndpoint() +
      "players?limit=400&withCount=true&sorts=metadata.overall&sortsOrders=ASC&excludingMflOwned=true&isFreeAgent=false&" +
      convertDictToUrlParams(params),
    handleSuccess,
    handleError
  );

export const getPlayerSales = ({ handleSuccess, handleError, params }) =>
  get(
    getMflApiEndpoint() +
      "listings?limit=25&type=PLAYER&status=BOUGHT&" +
      convertDictToUrlParams(params),
    handleSuccess,
    handleError
  );

/* CLUBS */

export const getClub = ({ handleSuccess, handleError, id }) =>
  get(getMflApiEndpoint() + "clubs/" + id, handleSuccess, handleError);

export const getClubSales = (handleSuccess, handleError, params) =>
  get(
    getMflApiEndpoint() +
      "listings?limit=25&type=CLUB&status=BOUGHT&" +
      convertDictToUrlParams(params),
    handleSuccess,
    handleError
  );

export const getClubStandings = ({ handleSuccess, handleError, params }) =>
  get(
    getMflApiEndpoint() + `clubs/${params.id}/standings`,
    handleSuccess,
    handleError
  );

/* LISTINGS */

export const getPlayerListings = ({ handleSuccess, handleError, params }) =>
  get(
    getMflApiEndpoint() +
      "listings?limit=25&type=PLAYER&status=AVAILABLE&view=full&" +
      convertDictToUrlParams(params),
    handleSuccess,
    handleError
  );

/* USERS */

export const getUsers = (handleSuccess, handleError, search) =>
  get(
    getMflApiEndpoint() + "users/search?search=" + search,
    handleSuccess,
    handleError
  );

/* MATCHES */

export const getMatches = ({ handleSuccess, handleError, params }) =>
  get(
    getMflApiEndpoint() + "matches?" + convertDictToUrlParams(params),
    handleSuccess,
    handleError
  );

export const getMatchReport = ({ handleSuccess, handleError, id }) =>
  get(
    getMflApiEndpoint() + "matches/" + id + "/report",
    handleSuccess,
    handleError
  );
