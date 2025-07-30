import React, { useState, useEffect } from "react";
import { NotificationManager as nm } from "react-notifications";
import { Outlet } from "react-router-dom";
import { useParams } from "react-router-dom";
import MenuPageNotification from "bars/MenuPageNotification.js";
import { getUsers } from "services/api-assistant.js";
import BoxScrollUp from "components/box/BoxScrollUp.js";
import ButtonLogin from "components/buttons/ButtonLogin.js";
import BoxLogin from "components/box/BoxLogin.js";
import { validateEmail } from "utils/re.js";
import { sendConfirmationMail } from "services/api-assistant.js";

interface PageNotificationProps {
  yScrollPosition: number;
  props: object;
}

const PageNotification: React.FC<PageNotificationProps> = (props) => {
  const { address } = useParams();
  const [user, setUser] = useState(null);
  const [emailValue, setEmailValue] = useState("");

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

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <div id="PageNotification" className="w-100 h-100">
      {props.yScrollPosition > 100 && <BoxScrollUp />}

      {!props.assistantUser && (
        <div className="d-flex h-100 justify-content-center align-items-center">
          <ButtonLogin
            className="PageNotificationMarketplace-ButtonLogin"
            flowUser={props.flowUser}
            assistantUser={props.assistantUser}
            logout={props.logout}
            content={<BoxLogin assistantUser={props.assistantUser} />}
          />
        </div>
      )}

      {props.assistantUser && !props.assistantUser.email && (
        <div className="d-flex h-100 justify-content-center align-items-center">
          <div>
            <div className="card px-4 py-2">
              <div className="my-1">Please provide your email:</div>

              <div className="my-1">
                <input
                  type="email"
                  className="form-control w-100 text-white"
                  value={emailValue}
                  onChange={(v) => setEmailValue(v.target.value)}
                  placeholder={"email@example.com..."}
                  autoFocus
                />
              </div>

              <div className="d-flex justify-content-end my-1">
                <button
                  className="btn btn-info text-white"
                  onClick={() => props.updateAssistantUser(emailValue)}
                  disabled={!validateEmail(emailValue)}
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {props.assistantUser && props.assistantUser.email && !props.assistantUser.isEmailConfirmed && (
        <div className="d-flex h-100 justify-content-center align-items-center">
          <div>
            <div className="card px-4 py-2" style={{ maxWidth: "400px" }}>
              <div className="my-1">
                Please confirm your address by clicking the confirmation link received via email:
              </div>

              <div className="my-1">
                <input
                  type="email"
                  className="form-control w-100 text-white"
                  value={props.assistantUser.email}
                  disabled={true}
                />
              </div>

              <div className="my-3">Once done, you can refresh this page.</div>

              <div className="d-flex justify-content-end my-1">
                <button
                  className="d-block btn btn-danger btn-sm text-white me-1"
                  onClick={() => props.updateAssistantUser(null)}
                >
                  <i className="bi bi-trash3"></i> Delete email
                </button>

                <button
                  className="d-block btn btn-info btn-sm text-white"
                  onClick={() =>
                    sendConfirmationMail({
                      handleSuccess: (v) => nm.info("The confirmation link has been sent via email"),
                      handleError: (v) => nm.error("Error while sending the email"),
                      params: {
                        address: props.assistantUser.address,
                        email: props.assistantUser.email,
                      },
                    })
                  }
                >
                  <i className="bi bi-envelope-arrow-up-fill"></i> Send new confirmation link
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {props.assistantUser && props.assistantUser.email && props.assistantUser.isEmailConfirmed && (
        <div className="d-flex flex-column w-100 h-100">
          <div className="flex-shrink-0">
            <MenuPageNotification user={user} {...props} />
          </div>

          <div className="flex-grow-1 overflow-auto">
            <Outlet context={user} />
          </div>
        </div>
      )}
    </div>
  );
};

export default PageNotification;
