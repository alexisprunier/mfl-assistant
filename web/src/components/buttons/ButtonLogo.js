import React from "react";
import "./ButtonLogo.css";
import Popup from "reactjs-popup";

interface ButtonLogoProps {}

const ButtonLogo: React.FC<ButtonLogoProps> = (props) => {
  return (
    <div className="ButtonLogo">
      <Popup
        trigger={
          <div class="position-relative d-inline-block image-wrapper mt-lg-2 me-1 me-lg-0">
            <img
              src="/media/images/coach.png"
              alt="MFL Coach"
              class="position-absolute bg-img"
            />

            <img
              src="/media/images/assistant.png"
              alt="MFL Assistant"
              class="img-fluid main-img"
            />
          </div>
        }
        modal
        closeOnDocumentClick
        className={"fade-in popup-md"}
      >
        {(close) => (
          <div className="container bg-dark overflow-auto border border-3 rounded-3 p-4">
            <div className="d-flex flex-column flex-md-row flex-fill">
              <div className="d-flex flex-grow-1 flex-basis-0 mb-4 mb-md-0 pe-md-1">
                <div className="d-flex flex-column align-items-center position-relative">
                  <img
                    style={{ maxHeight: "200px", maxWidth: "100%" }}
                    src="/media/images/assistant.png"
                    alt="MFL Assistant"
                  />

                  <div className="text-center mb-2">
                    Assistant helps you to be an effective agent with ecosystem
                    insights and market tools.
                  </div>

                  <div className="text-center">
                    <button
                      className="btn btn-info text-white"
                      onClick={() => close()}
                    >
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
                    Coach helps you to improve your results on the pitch with
                    deep game analysis.
                  </div>

                  <div className="text-center">
                    <button
                      className="btn btn-info text-white"
                      onClick={() => window.open("https://mfl-coach.com")}
                    >
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
