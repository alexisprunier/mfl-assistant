import React from 'react';
import "./Item.css";
import ButtonMflPlayerInfo from "components/buttons/ButtonMflPlayerInfo.js";
import ButtonMflPlayer from "components/buttons/ButtonMflPlayer.js";
import MiscOverall from "components/misc/MiscOverall.js";
import MiscFlag from "components/misc/MiscFlag.js";
import { unixTimestampToDayString } from "utils/date.js";

interface ItemCardCommunityMemberProps {
  image: string;
  countries: list;
  name: string;
  link: string
}

const ItemCardCommunityMember: React.FC < ItemCardCommunityMemberProps > = ({ image, countries, name, link }) => {
  return (
    <div className={"Item flex-fill"}>
      <div className="card bg-black d-flex flex-column py-1 px-2" style={{ minWidth: "140px" }}>
        <div className="d-flex flex-row">
          <div className="pe-2">
            image
          </div>

          <div className="d-flex flex-fill justify-content-end">
            55
          </div>
        </div>

        <div className="d-flex flex-row justify-content-end">
          {name}
        </div>
      </div>
    </div>
  );
};

export default ItemCardCommunityMember;