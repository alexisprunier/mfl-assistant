import React, { useState, useEffect } from "react";
import { NotificationManager as nm } from "react-notifications";
import "App.css";
import "statics/css/bootstrap.min.css";
import "statics/bootstrap-icons.css";
import { NotificationContainer } from "react-notifications";
import "react-notifications/lib/notifications.css";
import { BrowserRouter } from "react-router-dom";
import Router from "Router";
import * as fcl from "@onflow/fcl";
import {
  login,
  logout,
  getLoggedUser,
  addLoggedUser,
  updateLoggedUserEmail,
} from "services/api-assistant.js";
import { getApiEndpoint } from "utils/env.js";
import { verifyServiceData } from "utils/flow.js";

interface AppProps {}

const App: React.FC<AppProps> = (props) => {
  const [flowUser, setFlowUser] = useState();
  const [assistantUser, setAssistantUser] = useState();

  const accountProofDataResolver = async () => {
    const response = await fetch(getApiEndpoint() + "api/generate_nonce");
    const { nonce } = await response.json();

    return {
      appIdentifier: "mfl-assistant",
      nonce,
    };
  };

  const getToken = () => {
    if (flowUser && flowUser.loggedIn) {
      let service = flowUser.services
        .filter((s) => s.type === "account-proof")
        .pop();

      if (!service) {
        nm.error("Wallet service not found");
      } else {
        if (verifyServiceData(service)) {
          nm.error(verifyServiceData(service));
        } else {
          login({
            handleSuccess: (v) => {
              getAssistantUser();
            },
            handleError: () => {
              fcl.unauthenticate();
            },
            body: JSON.stringify(service.data),
          });
        }
      }
    }
  };

  const getAssistantUser = () => {
    getLoggedUser({
      handleSuccess: (v) => {
        if (!v.data.getLoggedUser) {
          setFlowUser(null);
          setAssistantUser(null);
        } else {
          setAssistantUser(v.data.getLoggedUser);
        }
      },
      handleError: (v) => {
        return;
      },
    });
  };

  const updateAssistantUser = (email) => {
    updateLoggedUserEmail({
      handleSuccess: (v) => {
        getAssistantUser();
        nm.info("The confirmation link has been sent via email");
      },
      params: {
        email,
      },
    });
  };

  const clearUsers = () => {
    setFlowUser(null);
    setAssistantUser(null);

    logout({
      handleSuccess: (v) => {
        nm.info("You have been logged out with success");
      },
    });
  };

  useEffect(() => {
    fcl.currentUser().subscribe(setFlowUser);
    fcl.config({
      "flow.network": "mainnet",
      "walletconnect.projectId": "mfl-assistant",
      "app.detail.title": "mfl-assistant",
      "app.detail.url": "https://mfl-assistant.com",
      "accessNode.api": "https://rest-mainnet.onflow.org",
      "discovery.wallet": "https://fcl-discovery.onflow.org/authn",
      "discovery.authn.endpoint": "https://fcl-discovery.onflow.org/api/authn",
      "discovery.authn.include": ["0xead892083b3e2c6c"],
      "fcl.accountProof.resolver": accountProofDataResolver,
    });

    if (flowUser && flowUser.loggedIn) {
      getToken();
    } else {
      getAssistantUser();
    }
  }, []);

  useEffect(() => {
    if (flowUser && flowUser.loggedIn) {
      getToken();
    }
  }, [flowUser]);

  return (
    <div id="App">
      <BrowserRouter>
        <Router
          flowUser={flowUser}
          assistantUser={assistantUser}
          updateAssistantUser={updateAssistantUser}
          logout={clearUsers}
          {...props}
        />
        <NotificationContainer />
      </BrowserRouter>
    </div>
  );
};

export default App;
