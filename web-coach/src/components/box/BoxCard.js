import React from "react";

interface BoxCardProps {
  className?: String;
  title?: object;
  actions?: object;
  content?: object;
  contentClassName?: string;
}

const BoxCard: React.FC<BoxCardProps> = ({
  className,
  title,
  actions,
  content,
  contentClassName,
}) => {
  return (
    <div
      className={
        "card d-flex flex-column m-2 p-3 pt-2 " + (className ? className : "")
      }
    >
      <div className="d-flex flex-row">
        <div className="d-flex">
          <h4 className="flex-grow-1">{title}</h4>
        </div>

        <div className="d-flex flex-fill overflow-auto justify-content-end align-items-end">
          {actions}
        </div>
      </div>

      <div
        className={
          "d-flex flex-fill " + (contentClassName ? contentClassName : "")
        }
      >
        {content}
      </div>
    </div>
  );
};

export default BoxCard;
