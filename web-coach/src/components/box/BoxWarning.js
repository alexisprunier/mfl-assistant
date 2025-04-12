import React from 'react';
import Popup from "reactjs-popup";


interface BoxWarningProps {
	content: object;
	className?: string;
}

const BoxWarning: React.FC<BoxWarningProps> = ({ content, className }) => {
  return (
    <div className={"BoxWarning " + className}>
    	<Popup
				trigger={
					<i className="bi bi-cone-striped text-warning"></i>
				}
				modal
				closeOnDocumentClick
				className={"slide-in"}
			>
				{(close) => (
					<div className="BoxWarning-content container bg-dark border border-warning border-3 rounded-3 p-4">
						<div className="row mb-4">
							<div className="col">
						  	<i className="bi bi-cone-striped text-warning h2"></i>
						  </div>
				      <div className="col-auto">
				        <button
									className={"btn"}
									onClick={close}>
									<i className="bi bi-x-lg"></i>
								</button>
							</div>
						</div>
						<div className="row mb-4">
							<div className="col-12">
								{content}
							</div>
						</div>
					</div>
				)}
			</Popup>
    </div>
  );
};

export default BoxWarning;