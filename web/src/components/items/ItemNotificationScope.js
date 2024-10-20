import React from 'react';
import "./Item.css";
import PopupNotificationScope from "components/popups/PopupNotificationScope.js";
import { prettifyId } from "utils/graphql.js";

interface ItemNotificationScopeProps {
  item: Object;
  isSelected?: bool;
  onSelect?: funct;
  onDelete?: funct;
}

const ItemNotificationScope: React.FC<ItemNotificationScopeProps> = ({ item, isSelected, onSelect, onDelete }) => {
  const paramToIgnore = ["id", "type"];

  const getParamCount = () => {
    const c = Object.keys(item)
      .filter((k) => paramToIgnore.indexOf(k) < 0)
      .filter((k) => item[k])
      .length;

    return c + " parameter" + (c > 1 ? "s" : "");
  }

  return (
    <div
      className={
        "Item ItemNotificationScope d-flex flex-column flex-sm-row w-100 "
        + (isSelected ? "selected" : "")
      }
      onClick={() => onSelect(item)}
    >
      <div className="d-flex flex-grow-0 px-1" style={{ width: 150 }}>
        <i className="bi bi-square-fill pe-1"></i> {prettifyId(item.id)}
      </div>
      <div className="d-flex flex-grow-0 px-1" style={{ width: 100 }}>
        Type: {item.type}
      </div>
      <div className="d-flex flex-grow-1 justify-content-md-center px-1">
        {getParamCount()}
      </div>
      <div className="d-flex flex-grow-0 px-1 text-info">
        <PopupNotificationScope
          item={item}
          trigger={
            <i className="bi bi-plus-circle-dotted"></i>
          }
          onDelete={onDelete}
        />
      </div>
    </div>
  );
};

export default ItemNotificationScope;