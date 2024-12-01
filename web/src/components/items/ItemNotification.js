import React from 'react';
import "./Item.css";
import { prettifyId } from "utils/graphql.js";
import { dateToTimezonedString } from "utils/date.js";
import PopupNotification from "components/popups/PopupNotification.js";

interface ItemNotificationProps {
  item: Object;
}

const ItemNotification: React.FC < ItemNotificationProps > = ({ item }) => {
  return (
    <div
      className={
        "Item ItemNotification no-hover d-flex flex-column flex-sm-row w-100 "
      }
    >
      <div className="d-flex flex-grow-0 px-1" style={{ width: 150 }}>
        <i className="bi bi-envelope-check-fill pe-1"></i> {prettifyId(item.id)}
      </div>
      <div className="d-flex flex-grow-0 px-1" style={{ width: 150 }}>
        Scope: {prettifyId(item.notificationScope?.id)}
      </div>
      <div className="d-flex flex-grow-1 px-1">
        <div className="text-truncate">
          {item.playerIds.length + " player" + (item.playerIds.length > 1 ? "s" : "")}
        </div>
      </div>
      <div className="d-flex flex-grow-0 justify-content-sm-end px-1" style={{ width: 150 }}>
        {item.sendingDate ? dateToTimezonedString(item.sendingDate) : "Not sent"}
      </div>
      <div className="d-flex flex-grow-0 px-1 text-info" role="button">
        <PopupNotification
          item={item}
          trigger={
            <i class="bi bi-eye-fill"></i>
          }
        />
      </div>
    </div>
  );
};

export default ItemNotification;