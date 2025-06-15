import React from "react";
import PopupInformation from "components/popups/PopupInformation.js";

interface PopupInformationPricingProps {}

const PopupInformationPricing: React.FC<
  PopupInformationPricingProps
> = ({}) => {
  return (
    <PopupInformation
      trigger={
        <i
          class="bi bi-info-circle-fill text-main"
          style={{ cursor: "pointer" }}
        ></i>
      }
      title={"The pricing is an estimation!"}
      content={
        <div>
          <p>
            The <strong>pricing</strong> shown is an <strong>estimation</strong>{" "}
            based on the <strong>last recorded sale</strong> for similar
            players, taking into account their <strong>age</strong>,{" "}
            <strong>overall rating (OVR)</strong>, and <strong>position</strong>
            .
          </p>
          <p>
            Keep in mind that <strong>each player is unique</strong>, and this
            estimation does not consider more granular details such as:
          </p>
          <ul>
            <li>Secondary positions</li>
            <li>Past progression</li>
            <li>Individual attributes</li>
            <li>Charisma (✨ well, if it actually has any impact 😉)</li>
          </ul>
          <div className="warning">
            ⚠️ <strong>Note:</strong> The displayed pricing is a <em>guide</em>,
            not a fixed market value. Actual sale prices may vary significantly
            depending on context. Do your own research!
          </div>
        </div>
      }
    />
  );
};

export default PopupInformationPricing;
