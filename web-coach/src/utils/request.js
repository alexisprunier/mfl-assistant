import { getApiEndpoint, getMflApiEndpoint } from "utils/env.js";

export const get = async (target, handleSuccess, handleError, credentials=true) => {
  try {
    let init = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    };

    if (target.startsWith(getApiEndpoint())) {
      init.headers["Access-Control-Allow-Origin"] = new URL(target).origin;

      if (credentials) {
        init.headers["Access-Control-Allow-Credentials"] = true;
        init.credentials = "include"
      }
    }

    const response = await fetch(target, init);
    const jsonData = await response.json();

    if (jsonData.errors) {
      handleError(jsonData.errors);
    } else {
      handleSuccess(jsonData);
    }
  } catch (error) {
    handleError(error);
  }
};

export const post = async (target, body, handleSuccess, handleError, credentials=true) => {
  try {
    let init = {
      method: "POST",
      body,
      headers: {
        "Content-Type": "application/json",
      },
    };

    if (target.startsWith(getApiEndpoint())) {
      init.headers["Access-Control-Allow-Origin"] = new URL(target).origin;

      if (credentials) {
        init.headers["Access-Control-Allow-Credentials"] = true;
        init.credentials = "include"
      }
    }

    const response = await fetch(target, init);
    const jsonData = await response.json();

    if (jsonData.errors) {
      handleError(jsonData);
    } else {
      handleSuccess(jsonData);
    }
  } catch (error) {
    handleError(error);
  }
};

export const loginPost = async (target, body, handleSuccess, handleError) => {
  try {
    const response = await fetch(
      target,
      {
        method: "POST",
        body,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Methods": "POST,OPTIONS,HEAD",
          "Access-Control-Allow-Origin": new URL(target).origin,
          "Access-Control-Allow-Credentials": true,
          "Access-Control-Expose-Headers": "set-cookie",
        },
        credentials: "include",
      },
    );

    const jsonData = await response.json();

    if (jsonData.errors) {
      handleError(jsonData);
    } else {
      handleSuccess(jsonData);
    }
  } catch (error) {
    handleError(error);
  }
};