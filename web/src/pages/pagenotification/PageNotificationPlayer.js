import BoxMessage from "components/box/BoxMessage.js";
import ItemNotification from "components/items/ItemNotification.js";
import ItemNotificationScope from "components/items/ItemNotificationScope.js";
import LoadingSquare from "components/loading/LoadingSquare.js";
import PopupNotificationScope from "components/popups/PopupNotificationScope.js";
import UtilConditionalRender from "components/utils/UtilConditionalRender.js";
import BoxCard from "components/box/BoxCard.js";
import React, { useEffect, useState } from "react";
import { getNotificationScopesAndNotifications, getNotificationsOfNotificationScope } from "services/api-assistant.js";

interface PageNotificationMarketplaceProps {}

const PageNotificationMarketplace: React.FC<PageNotificationMarketplaceProps> = (props) => {
  const [notificationScopes, setNotificationScopes] = useState(null);
  const [notifications, setNotifications] = useState(null);
  const [selectedNotificationScope, setSelectedNotificationScope] = useState(null);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [skip, setSkip] = useState(0);

  const fetchNotificationScopesAndNotifications = () => {
    getNotificationScopesAndNotifications({
      handleSuccess: (v) => {
        setNotificationScopes(v.data.getNotificationScopes);
      },
    });
  };

  const fetchNotificationsOfNotificationScope = () => {
    getNotificationsOfNotificationScope({
      handleSuccess: (v) => {
        if (skip > 0) {
          setNotifications(notifications.concat(v.data.getNotifications));
        } else {
          setNotifications(v.data.getNotifications);
        }

        setSkip(skip + 10);
      },
      params: {
        notificationScope: selectedNotificationScope?.id,
        type: "player",
        limit: 10,
        order: -1,
        skip,
      },
    });
  };

  useEffect(() => {
    if (props.assistantUser && props.assistantUser.email) {
      fetchNotificationScopesAndNotifications();
      fetchNotificationsOfNotificationScope();
    }
  }, [props.assistantUser]);

  useEffect(() => {
    setNotifications(null);
    setSelectedNotification(null);
    setSkip(0);
  }, [selectedNotificationScope, notificationScopes]);

  useEffect(() => {
    if (skip === 0) {
      fetchNotificationsOfNotificationScope();
    }
  }, [skip]);

  return (
    <div id="PageNotificationMarketplace" className="h-100 w-100">
      <div className="container max-width-md h-100 px-2 px-md-4 py-4">
        <div className="d-flex flex-column h-100 w-100">
          <BoxCard
            className="flex-md-grow-0 flex-basis-200"
            title={"Notification scopes"}
            contentClassName={"overflow-auto"}
            actions={
              notificationScopes?.length > 0 && (
                <PopupNotificationScope
                  trigger={
                    <button className="btn btn-info btn-sm text-white">
                      <i className="bi bi-plus"></i>
                    </button>
                  }
                  assistantUser={props.assistantUser}
                  onClose={fetchNotificationScopesAndNotifications}
                />
              )
            }
            content={
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
                          setSelectedNotificationScope(selectedNotificationScope?.id !== s.id ? s : null);
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
            }
          />

          <BoxCard
            className="flex-md-grow-1"
            title={"Notifications"}
            contentClassName={"overflow-auto"}
            content={
              <UtilConditionalRender
                value={notifications}
                renderUndefined={() => <LoadingSquare />}
                renderEmpty={() => <BoxMessage content={"No notification found"} />}
                renderOk={() => (
                  <div className="d-flex flex-column flex-fill height-md-0">
                    {notifications.map((n) => (
                      <ItemNotification
                        key={n.id}
                        item={n}
                        isSelected={selectedNotification?.id === n.id}
                        onSelect={(n) => {
                          setSelectedNotification(selectedNotification?.id !== n.id ? n : null);
                        }}
                      />
                    ))}

                    {notifications && (
                      <div className="d-flex justify-content-start">
                        <button className="btn btn-sm btn-link" onClick={() => fetchNotificationsOfNotificationScope()}>
                          Load more
                        </button>
                      </div>
                    )}
                  </div>
                )}
              />
            }
          />
        </div>
      </div>
    </div>
  );
};

export default PageNotificationMarketplace;
