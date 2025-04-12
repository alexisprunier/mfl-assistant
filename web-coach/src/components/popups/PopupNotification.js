import React, { useState } from 'react';
import Popup from "reactjs-popup";
import ItemPlayer from "components/items/ItemPlayer.js";
import { prettifyId } from "utils/graphql.js";

interface PFProps {
  item: Object;
  trigger: Object;
}

const PopupNotification: React.FC < PopupNotificationProps > = ({ item, trigger }) => {

  return (
    <div className="PopupNotification">
    	<Popup
				trigger={trigger}
				modal
				closeOnDocumentClick
				className={"fade-in popup-md"}
			>
				{(close) => (
					<div className="container bg-dark overflow-auto border border-info border-3 rounded-3 p-4">
						<div className="d-flex flex-row mb-3">
							<div className="flex-grow-1">
						  	<h2 className="text-white">
						  		Notification {prettifyId(item.id)}
						  	</h2>
						  </div>
				      <div className="flex-grow-0">
				        <button
									className={"btn"}
									onClick={close}>
									<i className="bi bi-x-lg"></i>
								</button>
							</div>
						</div>

						<div className="text-center m-1 mb-3">
							{item.playerIds.map((id) => (
								<div className="d-inline-block">
	                <ItemPlayer
	                  key={id}
	                  id={id}
	                />
                </div>
              ))}
						</div>
					</div>
				)}
			</Popup>
    </div>
  );
};

export default PopupNotification;