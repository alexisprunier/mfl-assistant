import React from 'react';
import "./Item.css";
import ButtonMflPlayerInfo from "components/buttons/ButtonMflPlayerInfo.js";
import ButtonMflPlayer from "components/buttons/ButtonMflPlayer.js";

interface ItemPlayerProps {
  id: Int;
}

const ItemPlayer: React.FC < ItemPlayerProps > = ({ id }) => {
  return (
    <div 
    	className="ItemPlayer d-flex flex-column mb-2"
    	style={{ maxWidth: 160 }}
    >
	    <div className="d-flex align-self-center mb-1">
	      <img
	        className="w-100 px-2"
	        src={"https://d13e14gtps4iwl.cloudfront.net/players/" + id + "/card_512.png"}
	        alt={"Player " + id}
	      />
	    </div>
	    <div className="d-flex align-self-center">
	      <div className="me-1">
	        <ButtonMflPlayer
	          playerId={id}
	        />
	      </div>
	      <div>
	        <ButtonMflPlayerInfo
	          playerId={id}
	        />
	      </div>
	    </div>
	  </div>
  );
};

export default ItemPlayer;