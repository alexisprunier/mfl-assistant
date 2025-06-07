import BoxMessage from "components/box/BoxMessage.js";
import ItemNotification from "components/items/ItemNotification.js";
import ItemClubNotificationScope from "components/items/ItemClubNotificationScope.js";
import LoadingSquare from "components/loading/LoadingSquare.js";
import PopupClubNotificationScope from "components/popups/PopupClubNotificationScope.js";
import UtilConditionalRender from "components/utils/UtilConditionalRender.js";
import React, { useEffect, useState } from "react";
import {
  getClubNotificationScopesAndNotifications,
  getNotificationsOfClubNotificationScope,
} from "services/api-assistant.js";

interface PageNotificationClubProps {}

const PageNotificationClub: React.FC<PageNotificationClubProps> = (props) => {
  const [notificationScopes, setNotificationScopes] = useState(null);
  const [notifications, setNotifications] = useState(null);
  const [selectedNotificationScope, setSelectedNotificationScope] =
    useState(null);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [skip, setSkip] = useState(0);

  const fetchClubNotificationScopesAndNotifications = () => {
    getClubNotificationScopesAndNotifications({
      handleSuccess: (v) => {
        setNotificationScopes(v.data.getClubNotificationScopes);
      },
    });
  };

  const fetchNotificationsOfClubNotificationScope = () => {
    getNotificationsOfClubNotificationScope({
      handleSuccess: (v) => {
        if (skip > 0) {
          setNotifications(notifications.concat(v.data.getNotifications));
        } else {
          setNotifications(v.data.getNotifications);
        }

        setSkip(skip + 10);
      },
      params: {
        clubNotificationScope: selectedNotificationScope?.id,
        type: "club",
        limit: 10,
        order: -1,
        skip,
      },
    });
  };

  useEffect(() => {
    if (props.assistantUser && props.assistantUser.email) {
      fetchClubNotificationScopesAndNotifications();
      fetchNotificationsOfClubNotificationScope();
    }
  }, [props.assistantUser]);

  useEffect(() => {
    setNotifications(null);
    setSelectedNotification(null);
    setSkip(0);
  }, [selectedNotificationScope, notificationScopes]);

  useEffect(() => {
    if (skip === 0) {
      fetchNotificationsOfClubNotificationScope();
    }
  }, [skip]);

  return (
    <div id="PageNotificationClub" className="h-100 w-100">
      <div className="container max-width-md h-100 px-2 px-md-4 py-4">
        <div className="d-flex flex-column h-100 w-100 fade-in">
          <div className="card d-flex flex-column flex-md-grow-0 m-2 p-3 pt-2 flex-basis-200">
            <div className="d-flex flex-row mb-2">
              <h4 className="flex-grow-1">Notification scopes</h4>

              {notificationScopes?.length > 0 && (
                <PopupClubNotificationScope
                  trigger={
                    <button className="btn btn-info btn-sm text-white">
                      <i className="bi bi-plus"></i>
                    </button>
                  }
                  assistantUser={props.assistantUser}
                  onClose={fetchClubNotificationScopesAndNotifications}
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
                        <PopupClubNotificationScope
                          trigger={
                            <button className="btn btn-info btn-sm text-white">
                              <i className="bi bi-plus"></i> Add scope
                            </button>
                          }
                          assistantUser={props.assistantUser}
                          onClose={fetchClubNotificationScopesAndNotifications}
                        />
                      </div>
                    }
                  />
                )}
                renderOk={() => (
                  <div className="w-100">
                    {notificationScopes.map((s) => (
                      <ItemClubNotificationScope
                        key={s.id}
                        item={s}
                        isSelected={selectedNotificationScope?.id === s.id}
                        onSelect={(s) => {
                          setSelectedNotificationScope(
                            selectedNotificationScope?.id !== s.id ? s : null
                          );
                        }}
                        onDelete={() => {
                          fetchClubNotificationScopesAndNotifications();
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

                    {notifications && (
                      <div className="d-flex justify-content-start">
                        <button
                          className="btn btn-sm btn-link"
                          onClick={() =>
                            fetchNotificationsOfClubNotificationScope()
                          }
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

export default PageNotificationClub;
