import React, { useState, useEffect } from 'react';
import { NotificationManager as nm } from "react-notifications";
import ButtonLogin from "components/buttons/ButtonLogin.js";
import LoadingSquare from "components/loading/LoadingSquare.js";
import BoxMessage from "components/box/BoxMessage.js";
import UtilConditionalRender from "components/utils/UtilConditionalRender.js";
import PopupNotificationScope from "components/popups/PopupNotificationScope.js";
import ItemNotificationScope from "components/items/ItemNotificationScope.js";
import ItemNotification from "components/items/ItemNotification.js";
import ItemPlayer from "components/items/ItemPlayer.js";
import {
  getNotificationScopesAndNotifications,
  getNotificationsOfNotificationScope,
  sendConfirmationMail,
} from "services/api-assistant.js";
import { validateEmail } from "utils/re.js";

interface PageNotificationProps {}

const PageNotification: React.FC < PageNotificationProps > = (props) => {
  const [notificationScopes, setNotificationScopes] = useState(null);
  const [notifications, setNotifications] = useState(null);
  const [selectedNotificationScope, setSelectedNotificationScope] = useState(null);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [emailValue, setEmailValue] = useState("");

  const fetchNotificationScopesAndNotifications = () => {
    getNotificationScopesAndNotifications({
      handleSuccess: (v) => {
        setNotificationScopes(v.data.getNotificationScopes);
        setNotifications(v.data.getNotifications);
      },
    });
  }

  const fetchNotificationsOfNotificationScope = () => {
    if (selectedNotificationScope) {
      getNotificationsOfNotificationScope({
        handleSuccess: (v) => {
          if (notifications) {
            setNotifications(notifications.concat(v.data.getNotifications));
          } else {
            setNotifications(v.data.getNotifications);
          }
        },
        params: {
          notificationScope: selectedNotificationScope.id,
          skip: notifications ? notifications.length : 0,
          limit: 10,
          order: -1,
        }
      });
    }
  }

  useEffect(() => {
    if (props.assistantUser?.email) {
      fetchNotificationScopesAndNotifications();
    }
  }, [props.assistantUser]);

  useEffect(() => {
    setNotifications(null);
    setSelectedNotification(null);
  }, [selectedNotificationScope]);

  useEffect(() => {
    if (notifications === null) {
      if (selectedNotificationScope?.id) {
        fetchNotificationsOfNotificationScope();
      } else {
        setNotifications([])
      }
    }
  }, [notifications]);

  const getContent = () => {
    if (!props.assistantUser) {
      return (
        <div className="d-flex h-100 justify-content-center align-items-center">
          <div className="card">
            <ButtonLogin
              className="PageNotification-ButtonLogin fade-in h4 mx-4 my-3"
              flowUser={props.flowUser}
              assistantUser={props.assistantUser}
              logout={props.logout}
            />
          </div>
        </div>
      )
    }

    if (!props.assistantUser) {
      return <div className="d-flex h-100">
        <LoadingSquare />
      </div>;
    }

    if (!props.assistantUser.email) {
      return (
        <div className="d-flex h-100 justify-content-center align-items-center">
          <div className="fade-in">
            <div className="card px-4 py-2">
              <div className="my-1">
                Please provide your email:
              </div>

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
      )
    }

    return (
      <div className="d-flex flex-column h-100 w-100 fade-in">
        <div className="d-flex flex-column flex-md-row flex-md-grow-0 flex-basis-300">
          <div className="card c d-flex flex-column flex-md-grow-0 flex-basis-300 m-2 p-3 pt-2">
            <div className="d-flex flex-row mb-2">
              <h4 className="flex-grow-1">Email information</h4>
            </div>

            <div className="d-flex overflow-auto">
              {props.assistantUser
                ? <div>
                  <div className="mb-2">
                    <div className="lh-1">Address:</div>
                    <div className="text-white">{props.assistantUser.email}</div>
                  </div>
                  <div className="mb-2">
                    <div className="lh-1">Status:</div>
                    <div className="text-white">
                      {props.assistantUser.isEmailConfirmed
                        ? <div className="text-info">Confirmed</div>
                        : <div className="text-warning">Waiting for confirmation</div>
                      }
                    </div>
                  </div>
                  <div className="my-2">
                    {!props.assistantUser.isEmailConfirmed
                      && <button
                        className="d-block btn btn-info btn-sm text-white mb-1"
                        onClick={() => sendConfirmationMail({
                          handleSuccess: (v) => nm.info("The confirmation link has been sent via email"),
                          handleError: (v) => nm.error("Error while sending the email"),
                          params: {
                            address: props.assistantUser.address,
                            email: props.assistantUser.email,
                          }
                        })}
                      >
                        <i className="bi bi-envelope-arrow-up-fill"></i> Send new confirmation link
                      </button>
                    }
                    <button
                      className="d-block btn btn-danger btn-sm text-white mb-1"
                      onClick={() => props.updateAssistantUser(null)}
                    >
                      <i className="bi bi-trash3"></i> Delete email
                    </button>
                  </div>
                </div>
                : <LoadingSquare />
              }
            </div>
          </div>

          <div className="card d-flex flex-column flex-md-grow-1 m-2 p-3 pt-2 max-height-md-300">
            <div className="d-flex flex-row mb-2">
              <h4 className="flex-grow-1">Notification scopes</h4>

              {notificationScopes?.length > 0
                && <PopupNotificationScope
                  trigger={
                    <button className="btn btn-info btn-sm text-white">
                      <i className="bi bi-plus"></i>
                    </button>
                  }
                  assistantUser={props.assistantUser}
                  onClose={fetchNotificationScopesAndNotifications}
                />
              }
            </div>

            <div className="d-flex flex-fill overflow-auto">
              <UtilConditionalRender
                value={notificationScopes}
                renderUndefined={() => <LoadingSquare />}
                renderEmpty={
                  () => <BoxMessage
                    content={
                      <div>
                        <div>No scope found</div>
                        <PopupNotificationScope
                          trigger={
                            <button
                              className="btn btn-info btn-sm text-white">
                              <i className="bi bi-plus"></i> Add scope
                            </button>
                          }
                          assistantUser={props.assistantUser}
                          onClose={fetchNotificationScopesAndNotifications}
                        />
                      </div>
                    }
                  />
                }
                renderOk={
                  () => <div className="w-100">
                    {notificationScopes.map((s) => (
                      <ItemNotificationScope
                        key={s.id}
                        item={s}
                        isSelected={selectedNotificationScope?.id === s.id}
                        onSelect={(s) => {
                          setSelectedNotificationScope(
                            selectedNotificationScope?.id !== s.id ? s : null
                          );
                        }}
                        onDelete={() => {
                          setNotificationScopes(null);
                          setNotifications(null);
                        }}
                      />
                    ))}
                  </div>
                }
              />
            </div>
          </div>
        </div>

      <
      div className = "d-flex flex-column flex-md-row flex-md-grow-1" >
      <div className="card d-flex flex-column flex-md-grow-1 m-2 p-3 pt-2">
            <div className="d-flex flex-row mb-2">
              <h4 className="flex-grow-1">Notifications</h4>
            </div>

            <div className="d-flex flex-fill overflow-auto">
              <UtilConditionalRender
                value={notifications}
                renderUndefined={() => <LoadingSquare />}
                renderEmpty={() => <BoxMessage content={"No notification found"} />}
                renderOk={
                  () => <div className="d-flex flex-column flex-fill height-md-0">
                    {notifications.map((n) => (
                      <ItemNotification
                        key={n.id}
                        item={n}
                        isSelected={selectedNotification?.id === n.id}
                        onSelect={(n) => {
                          setSelectedNotification(
                            selectedNotification?.id !== n.id ? n : null
                          );
                        }}
                      />
                    ))}

                    {selectedNotificationScope && notifications
                      && <div
                        className="d-flex justify-content-start"
                      >
                        <button
                          className="btn btn-sm btn-link"
                          onClick={fetchNotificationsOfNotificationScope}
                        >
                          Load more
                        </button>
                      </div>
                    }
                  </div>
                }
              />
            </div>
          </div>

      <
      div className = "card d-flex flex-column flex-md-grow-0 flex-basis-200 m-2 p-3 pt-2" >
      <div className="d-flex flex-row mb-2">
              <h4 className="flex-grow-1">Players</h4>
            </div>

      <
      div className = "d-flex flex-fill overflow-auto justify-content-center" >
      <UtilConditionalRender
                value={selectedNotification?.playerIds}
                renderUndefined={() => <BoxMessage content={"No notification selected"} />
    }
    renderEmpty = {
      () => <BoxMessage content={"No player to display"} />
    }
    renderOk = {
      () => <div className="d-flex flex-column height-md-0">
                    {selectedNotification.playerIds.map((id) => (
                      <ItemPlayer
                        key={id}
                        id={id}
                      />
                    ))}
                  </div>
    }
    /> < /
    div > <
      /div> < /
    div > <
      /div>
  );
}

return (
  <div id="PageNotification" className="h-100 w-100">
      <div className="container-xl h-100 w-100 px-4 py-5">
        {getContent()}
      </div>
    </div>
);
};

export default PageNotification;