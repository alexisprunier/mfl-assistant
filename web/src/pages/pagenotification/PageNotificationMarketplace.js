import React, { useState, useEffect } from "react";
import { NotificationManager as nm } from "react-notifications";
import ButtonLogin from "components/buttons/ButtonLogin.js";
import BoxLogin from "components/box/BoxLogin.js";
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

interface PageNotificationMarketplaceProps {}

const PageNotificationMarketplace: React.FC<
  PageNotificationMarketplaceProps
> = (props) => {
  const [notificationScopes, setNotificationScopes] = useState(null);
  const [notifications, setNotifications] = useState(null);
  const [selectedNotificationScope, setSelectedNotificationScope] =
    useState(null);
  const [selectedNotification, setSelectedNotification] = useState(null);

  const fetchNotificationScopesAndNotifications = () => {
    getNotificationScopesAndNotifications({
      handleSuccess: (v) => {
        setNotificationScopes(v.data.getNotificationScopes);
        setNotifications(v.data.getNotifications);
      },
    });
  };

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
        },
      });
    }
  };

  useEffect(() => {
    if (props.assistantUser && props.assistantUser.email) {
      fetchNotificationScopesAndNotifications();
    }
  }, [props.assistantUser]);

  useEffect(() => {
    setNotifications(null);
    setSelectedNotification(null);
  }, [selectedNotificationScope]);

  useEffect(() => {
    if (notifications === null) {
      if (selectedNotificationScope && selectedNotificationScope.id) {
        fetchNotificationsOfNotificationScope();
      } else {
        setNotifications([]);
      }
    }
  }, [notifications]);

  return (
    <div id="PageNotificationMarketplace" className="h-100 w-100">
      <div className="container max-width-md h-100 px-2 px-md-4 py-4">
        <div className="d-flex flex-column h-100 w-100 fade-in">
          <div className="card d-flex flex-column flex-md-grow-0 m-2 p-3 pt-2 flex-basis-200">
            <div className="d-flex flex-row mb-2">
              <h4 className="flex-grow-1">Notification scopes</h4>

              {notificationScopes?.length > 0 && (
                <PopupNotificationScope
                  trigger={
                    <button className="btn btn-info btn-sm text-white">
                      <i className="bi bi-plus"></i>
                    </button>
                  }
                  assistantUser={props.assistantUser}
                  onClose={fetchNotificationScopesAndNotifications}
                />
              )}
            </div>

            <div className="d-flex flex-fill overflow-auto">
              <UtilConditionalRender
                value={notificationScopes}
                renderUndefined={() => <LoadingSquare />}
                renderEmpty={() => (
                  <BoxMessage
                    content={
                      <div>
                        <div>No scope found</div>
                        <PopupNotificationScope
                          trigger={
                            <button className="btn btn-info btn-sm text-white">
                              <i className="bi bi-plus"></i> Add scope
                            </button>
                          }
                          assistantUser={props.assistantUser}
                          onClose={fetchNotificationScopesAndNotifications}
                        />
                      </div>
                    }
                  />
                )}
                renderOk={() => (
                  <div className="w-100">
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
                          fetchNotificationScopesAndNotifications();
                          setSelectedNotificationScope(null);
                          setSelectedNotification(null);
                        }}
                      />
                    ))}
                  </div>
                )}
              />
            </div>
          </div>

          <div className="card d-flex flex-column flex-md-grow-1 m-2 p-3 pt-2">
            <div className="d-flex flex-row mb-2">
              <h4 className="flex-grow-1">Notifications</h4>
            </div>

            <div className="d-flex flex-fill overflow-auto">
              <UtilConditionalRender
                value={notifications}
                renderUndefined={() => <LoadingSquare />}
                renderEmpty={() => (
                  <BoxMessage content={"No notification found"} />
                )}
                renderOk={() => (
                  <div className="d-flex flex-column flex-fill height-md-0">
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

                    {selectedNotificationScope && notifications && (
                      <div className="d-flex justify-content-start">
                        <button
                          className="btn btn-sm btn-link"
                          onClick={fetchNotificationsOfNotificationScope}
                        >
                          Load more
                        </button>
                      </div>
                    )}
                  </div>
                )}
              />
            </div>
          </div>
        </div>
      </div>{" "}
    </div>
  );
};

export default PageNotificationMarketplace;
