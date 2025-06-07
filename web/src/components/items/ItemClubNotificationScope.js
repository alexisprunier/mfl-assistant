import React from "react";
import "./Item.css";
import PopupClubNotificationScope from "components/popups/PopupNotificationScope.js";
import { prettifyId } from "utils/graphql.js";

interface ItemClubNotificationScopeProps {
  item: Object;
  isSelected?: boolean;
  onSelect?: funct;
  onDelete?: funct;
}

const ItemClubNotificationScope: React.FC<ItemClubNotificationScopeProps> = ({
  item,
  isSelected,
  onSelect,
  onDelete,
}) => {
  const generateDescription = (criteria) => {
    const descriptions = [];

    for (const [key, value] of Object.entries(criteria)) {
      if (value !== undefined && value !== null) {
        // Extract the stat name (after "min" or "max") and convert to uppercase
        const stat = key.slice(3).toUpperCase();

        if (key === "countries" && value.length > 0) {
          descriptions.push(value.join("/"));
        }
        if (key === "cities" && value.length > 0) {
          descriptions.push(value.join("/"));
        }
        if (key === "divisions" && value.length > 0) {
          descriptions.push(value.join("/"));
        }
        if (key.startsWith("min")) {
          descriptions.push(`${stat} >= ${value}`);
        } else if (key.startsWith("max")) {
          descriptions.push(`${stat} <= ${value}`);
        }
      }
    }

    return descriptions.join(", ");
  };

  return (
    <div
      className={
        "Item ItemClubNotificationScope d-flex flex-column flex-sm-row w-100 " +
        (isSelected ? "selected" : "")
      }
      onClick={() => onSelect(item)}
    >
      <div className="d-flex flex-grow-0 px-1" style={{ width: 130 }}>
        <i className="bi bi-alarm-fill pe-1"></i> {prettifyId(item.id)}
      </div>
      <div className="d-flex flex-grow-0 px-1" style={{ width: 150 }}>
        Type: {item.type}
      </div>
      <div className="d-flex flex-grow-1 text-truncate px-1">
        <div className="text-truncate">{generateDescription(item)}</div>
      </div>
      <div className="d-flex flex-grow-0 px-1 text-info">
        <PopupClubNotificationScope
          item={item}
          trigger={<i className="bi bi-pencil-square" />}
          onDelete={onDelete}
        />
      </div>
    </div>
  );
};

export default ItemClubNotificationScope;
