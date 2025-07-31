import React from "react";
import "./ButtonLogo.css";
import Popup from "reactjs-popup";

interface ButtonLogoProps {}

const ButtonLogo: React.FC<ButtonLogoProps> = (props) => {
  return (
    <div className="ButtonLogo">
      <Popup
        trigger={
          <div class="position-relative d-inline-block image-wrapper mt-lg-3 ms-3 me-2 me-lg-1 ms-lg-0 mb-lg-3">
            <img src="/media/images/coach.png" alt="MFL Coach" class="position-absolute bg-img" />

            <img src="/media/images/assistant.png" alt="MFL Assistant" class="img-fluid main-img" />
          </div>
        }
        modal
        closeOnDocumentClick
        className={"fade-in popup-md"}
      >
        {(close) => (
          <div>
            <div className="d-flex flex-column flex-md-row flex-fill">
              <div className="d-flex flex-grow-1 flex-basis-0 mb-4 mb-md-0">
                <div className="d-flex flex-column align-items-center position-relative">
                  <img
                    style={{ maxHeight: "200px", maxWidth: "100%" }}
                    src="/media/images/assistant.png"
                    alt="MFL Assistant"
                  />

                  <div className="text-center mb-2">
                    Assistant helps you to be an effective agent with ecosystem insights and market tools.
                  </div>

                  <div className="text-center">
                    <button className="btn btn-info text-white" onClick={() => close()}>
                      Stay with Assistant
                    </button>
                  </div>
                </div>
              </div>

              <div className="d-flex flex-grow-1 flex-basis-0 ps-md-1">
                <div className="d-flex flex-column align-items-center position-relative">
                  <img
                    style={{
                      maxHeight: "200px",
                      maxWidth: "100%",
                    }}
                    src="/media/images/coach.png"
                    alt="MFL Coach"
                  />

                  <div className="text-center mb-2">
                    Coach helps you to improve your results on the pitch with deep game analysis.
                  </div>

                  <div className="text-center">
                    <button className="btn btn-info text-white" onClick={() => window.open("https://mfl-coach.com")}>
                      Visit Coach
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </Popup>
    </div>
  );
};

export default ButtonLogo;
