import React, { useState } from 'react';
import { NotificationManager as nm } from "react-notifications";
import Popup from "reactjs-popup";
import { addNotificationScope, deleteNotificationScope } from "services/api-assistant.js";
import { prettifyId } from "utils/graphql.js";

interface PopupNotificationScopeProps {
	trigger: Object;
	item?: Object;
	assistantUser?: Object;
	onClose?: func;
	onDelete?: func;
}

const PopupNotificationScope: React.FC<PopupNotificationScopeProps> = ({ trigger, item, assistantUser, onClose, onDelete }) => {
	const readOnly = typeof item?.id !== "undefined";

	const [showAttributeDetail, setShowAttributeDetail] = useState(false);

	const [typeValues] = useState(["listing", "sale"]);
	const [type, setType] = useState(typeValues[0]);

	const [positions, setPositions] = useState(undefined);
	const [nationalities, setNationalities] = useState(undefined);

	const [minPrice, setMinPrice] = useState(item?.minPrice ? item.minPrice : "");
	const [maxPrice, setMaxPrice] = useState(item?.maxPrice ? item.maxPrice : "");
	const [minAge, setMinAge] = useState(item?.minAge ? item.minAge : "");
	const [maxAge, setMaxAge] = useState(item?.maxAge ? item.maxAge : "");
	const [minOvr, setMinOvr] = useState(item?.minOvr ? item.minOvr : "");
	const [maxOvr, setMaxOvr] = useState(item?.maxOvr ? item.maxOvr : "");

	const [minPac, setMinPac] = useState(item?.minPac ? item.minPac : "");
	const [maxPac, setMaxPac] = useState(item?.maxPac ? item.maxPac : "");
	const [minDri, setMinDri] = useState(item?.minDri ? item.minDri : "");
	const [maxDri, setMaxDri] = useState(item?.maxDri ? item.maxDri : "");
	const [minPas, setMinPas] = useState(item?.minPas ? item.minPas : "");
	const [maxPas, setMaxPas] = useState(item?.maxPas ? item.maxPas : "");
	const [minSho, setMinSho] = useState(item?.minSho ? item.minSho : "");
	const [maxSho, setMaxSho] = useState(item?.maxSho ? item.maxSho : "");
	const [minDef, setMinDef] = useState(item?.minDef ? item.minDef : "");
	const [maxDef, setMaxDef] = useState(item?.maxDef ? item.maxDef : "");
	const [minPhy, setMinPhy] = useState(item?.minPhy ? item.minPhy : "");
	const [maxPhy, setMaxPhy] = useState(item?.maxPhy ? item.maxPhy : "");

	const confirm = (close) => {
		addNotificationScope({
      handleSuccess: (v) => {
      	if (v.errors) {
      		nm.warning("Error while adding the scope");
      		return;
      	}

      	nm.info("The notification scope has been added");
      	if (onClose) onClose();
      	close();
      },
      params: {
      	user: assistantUser?.address,
      	type,
      	positions,
      	nationalities,
      	minPrice,
      	maxPrice,
      	minAge,
      	maxAge,
      	minOvr,
      	maxOvr,
      	minPac,
      	maxPac,
      	minDri,
      	maxDri,
      	minPas,
      	maxPas,
      	minSho,
      	maxSho,
      	minDef,
      	maxDef,
      	minPhy,
      	maxPhy,
      },
    });
	}

	const deleteScope = (close) => {
		deleteNotificationScope({
      handleSuccess: (v) => {
      	if (v.errors) {
      		nm.warning("Error while deleting the scope");
      		if (onDelete) {
      			onDelete();
      		}
      		return;
      	}

      	nm.info("The notification scope has been deleted");
      	if (onClose) onClose();
      	close();
      },
      params: {
      	scopeId: item.id 
      },
    });
	}

	const getField = (value, setValue, placeholder="") => {
		return <input
			className="form-control w-auto flex-grow-0 me-1"
			disabled={readOnly}
			value={value}
			placeholder={placeholder}
			onChange={(v) => setValue(parseInt(v.target.value, 10))}
			type="number"
			min="1"
			max="99"
			step="1"
		/>
	}

  return (
    <div className="PopupNotificationScope">
    	<Popup
				trigger={trigger}
				modal
				closeOnDocumentClick
				onClose={onClose}
				className={"fade-in popup-md"}
			>
				{(close) => (
					<div className="container bg-dark border border-info border-3 rounded-3 p-4">
						<div className="d-flex flex-row mb-3">
							<div className="flex-grow-1">
						  	<h2 className="text-white">
						  		{readOnly
						  			? "Scope " + prettifyId(item.id)
						  			: "Add a new scope"
						  		}
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

						<div className="d-flex flex-row m-1 mb-3">
							<div className="flex-grow-1 align-self-center">Type of notification:</div>
							<div className="flex-grow-1 me-1">
								<select
									className="form-select"
									disabled={readOnly}
									value={type}
									onChange={(v) => setType(v.target.value)}
								>
									{typeValues
										.map((v) => (
										<option value={v} key={v}>
											{v.charAt(0).toUpperCase() + v.slice(1)}
										</option>
									))}
								</select>
							</div>
						</div>

						<div className="d-flex flex-row m-1">
							<div className="flex-grow-1 align-self-center">Price:</div>
							{getField(minPrice, setMinPrice, "min")}
							{getField(maxPrice, setMaxPrice, "max")}
						</div>

						<div className="d-flex flex-row m-1">
							<div className="flex-grow-1 align-self-center">Age:</div>
							{getField(minAge, setMinAge, "min")}
							{getField(maxAge, setMaxAge, "max")}
						</div>

						<div className="d-flex flex-row m-1">
							<div className="flex-grow-1 align-self-center">Overall:</div>
							{getField(minOvr, setMinOvr, "min")}
							{getField(maxOvr, setMaxOvr, "max")}
						</div>

						<div className="d-flex justify-content-end my-3">
							<div>
								<button
		              className="btn btn-sm text-info"
		              onClick={() => setShowAttributeDetail(!showAttributeDetail)}
		             >
		              {showAttributeDetail
		              	? <span><i className="bi bi-dash"></i> Hide attributes</span>
		              	: <span><i className="bi bi-plus"></i> Show attributes</span>
		              }
		            </button>
		          </div>
	          </div>

						{showAttributeDetail
							&& <div className="mb-1">
								<div className="d-flex flex-row m-1">
									<div className="flex-grow-1 align-self-center">PAC:</div>
									{getField(minPac, setMinPac, "min")}
									{getField(maxPac, setMaxPac, "max")}
								</div>
								<div className="d-flex flex-row m-1">
									<div className="flex-grow-1 align-self-center">DRI:</div>
									{getField(minDri, setMinDri, "min")}
									{getField(maxDri, setMaxDri, "max")}
								</div>
								<div className="d-flex flex-row m-1">
									<div className="flex-grow-1 align-self-center">PAS:</div>
									{getField(minPas, setMinPas, "min")}
									{getField(maxPas, setMaxPas, "max")}
								</div>
								<div className="d-flex flex-row m-1">
									<div className="flex-grow-1 align-self-center">SHO:</div>
									{getField(minSho, setMinSho, "min")}
									{getField(maxSho, setMaxSho, "max")}
								</div>
								<div className="d-flex flex-row m-1">
									<div className="flex-grow-1 align-self-center">DEF:</div>
									{getField(minDef, setMinDef, "min")}
									{getField(maxDef, setMaxDef, "max")}
								</div>
								<div className="d-flex flex-row m-1">
									<div className="flex-grow-1 align-self-center">PHY:</div>
									{getField(minPhy, setMinPhy, "min")}
									{getField(maxPhy, setMaxPhy, "max")}
								</div>
							</div>
						}

			      <div className="d-flex flex-row justify-content-end mt-3">
							<div>
								{readOnly
									? <button
										className="btn btn-danger text-white"
										onClick={() => deleteScope(close)}
									>
										<i className="bi bi-trash3"></i> Delete
									</button>
									: <button
										className="btn btn-info text-white"
										onClick={() => confirm(close)}
									>
										Confirm
									</button>
								}
							</div>
						</div>
					</div>
				)}
			</Popup>
    </div>
  );
};

export default PopupNotificationScope;