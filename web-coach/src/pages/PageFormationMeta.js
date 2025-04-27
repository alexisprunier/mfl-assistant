import React, { useEffect, useState } from "react";
import { getFormationMetaEngines } from "services/api-assistant.js";
import BoxCard from "components/box/BoxCard.js";
import LoadingSquare from "components/loading/LoadingSquare.js";

interface PageFormationMetaProps {}

const PageFormationMeta: React.FC<PageFormationMetaProps> = (props) => {
  const [engines, setEngines] = useState(null);
  const [selectedEngine, setSelectedEngine] = useState(null);
  const [formationMetas, setFormationMetas] = useState(null);

  const fetchFormationMetaEngines = () => {
    getFormationMetaEngines({
      handleSuccess: (d) => {
        setEngines(d.getFormationMetaEngines);
      },
      handleError: (e) => console.log(e),
    });
  };

  useEffect(() => {
    fetchFormationMetaEngines();
  }, []);

  return (
    <div id="PageFormationMeta" className="w-100 h-100">
      <nav className="TopBar navbar w-100 ps-md-5 px-4 py-2">
        <h3 className="my-2">
          <i className="bi bi-grid-3x3-gap-fill me-2"></i> Formation meta
        </h3>
      </nav>

      <div className="container-xl">
        <div className="d-flex flex-column">
          <div className="d-flex flex-grow-0">
            <BoxCard
              content={<>{engines ? <div>yo</div> : <LoadingSquare />}</>}
            />
          </div>

          <div className="d-flex flex-grow-1">
            <BoxCard content={<div>yo</div>} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PageFormationMeta;
