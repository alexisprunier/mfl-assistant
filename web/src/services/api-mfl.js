import { get } from "utils/request.js";
import { getMflApiEndpoint } from "utils/env.js";
import { convertDictToUrlParams } from "utils/url.js";

/* COMPETITIONS */

export const getPastCompetitions = (handleSuccess, handleError) => get(
  getMflApiEndpoint() + "competitions?past=true",
  handleSuccess,
  handleError,
);

export const getUpcomingCompetitions = (handleSuccess, handleError) => get(
  getMflApiEndpoint() + "competitions?upcoming=true",
  handleSuccess,
  handleError,
);

/* PLAYERS */

export const getPlayers = (handleSuccess, handleError, params) => get(
  getMflApiEndpoint() +
  "players?limit=400&withCount=true&" +
  convertDictToUrlParams(params),
  handleSuccess,
  handleError,
);

export const getPlayerCount = (handleSuccess, handleError, params) => get(
  getMflApiEndpoint() +
  "players?limit=1&withCount=true&excludingMflOwned=true&" +
  convertDictToUrlParams(params),
  handleSuccess,
  handleError,
);

export const getUnderContractPlayers = (handleSuccess, handleError, params) => get(
  getMflApiEndpoint() +
  "players?limit=400&withCount=true&sorts=metadata.overall&sortsOrders=ASC&excludingMflOwned=true&isFreeAgent=false&" +
  convertDictToUrlParams(params),
  handleSuccess,
  handleError,
);

export const getPlayerSales = ({ handleSuccess, handleError, params }) => get(
  getMflApiEndpoint() +
  "listings?limit=25&type=PLAYER&status=BOUGHT&" +
  convertDictToUrlParams(params),
  handleSuccess,
  handleError,
);

/* CLUBS */

export const getClubSales = (handleSuccess, handleError, params) => get(
  getMflApiEndpoint() +
  "listings?limit=25&type=CLUB&status=BOUGHT&" +
  convertDictToUrlParams(params),
  handleSuccess,
  handleError,
);

/* LISTINGS */

export const getPlayerListings = ({ handleSuccess, handleError, params }) => get(
  getMflApiEndpoint() +
  "listings?limit=25&type=PLAYER&status=AVAILABLE&view=full&" +
  convertDictToUrlParams(params),
  handleSuccess,
  handleError,
);

/* USERS */

export const getUsers = (handleSuccess, handleError, search) => get(
  getMflApiEndpoint() + "users/search?search=" + search,
  handleSuccess,
  handleError,
);