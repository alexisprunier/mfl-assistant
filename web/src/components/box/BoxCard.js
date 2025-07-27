import React from "react";

interface BoxCardProps {
  className?: string;
  title?: React.ReactNode;
  actions?: React.ReactNode;
  content?: React.ReactNode;
  contentClassName?: string;
}

const BoxCard: React.FC<BoxCardProps> = ({ className, title, actions, content, contentClassName }) => {
  return (
    <div
      className={"card d-flex flex-column m-2 p-3 pt-2 " + (content ? "" : "pb-2 ") + (className ? className : "")}
      style={{
        borderWidth: "1px",
        borderStyle: "solid",
        borderRadius: 0, // no rounding
        borderImageSlice: 1,
        borderImageSource: "linear-gradient(135deg, rgba(13, 202, 240, 0.5), rgba(255, 255, 255, 0.3), transparent)",
        backgroundColor: "#2c2f33", // modern dark grey
        color: "#e0e0e0", // light text for contrast
      }}
    >
      <div className="d-flex flex-row">
        <div className="d-flex">
          <h4 className={"flex-grow-1 " + (content ? "" : "mb-0")}>{title}</h4>
        </div>

        <div className="d-flex flex-fill overflow-auto justify-content-end align-items-end">{actions}</div>
      </div>

      <div className={"d-flex flex-fill " + (contentClassName ? contentClassName : "")}>{content}</div>
    </div>
  );
};

export default BoxCard;
