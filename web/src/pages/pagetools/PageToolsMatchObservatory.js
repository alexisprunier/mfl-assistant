import React from "react";

interface PageToolsMatchObservatoryProps {}

const PageToolsMatchObservatory: React.FC<PageToolsMatchObservatoryProps> = (
  props
) => {
  return (
    <div id="PageToolsMatchObservatory" className="h-100 w-100">
      <div className="d-flex h-100 w-100 justify-content-center align-items-center">
        <div className="card d-flex flex-column p-3 pt-2 mx-1">
          <h4>Assistant has a new colleague!</h4>

          <div className="d-flex flex-column flex-md-row">
            <div className="d-flex flex-fill justify-content-center">
              <img
                style={{ width: "120px", height: "120px" }}
                src="/media/images/coach.png"
                alt="MFL Assistant"
              />
            </div>

            <div className="d-flex flex-column flex-fill align-items-center justify-content-center px-2">
              <div className="py-3">
                <b>The Match Observatory</b>
                <br />
                has been renamed to Match Analysis
                <br />
                and is now managed by the MFL Coach.
              </div>

              <div>
                <button
                  className="d-flex flex-row btn btn-info text-white me-1"
                  style={{ backgroundColor: "#f86285", borderColor: "#f86285" }}
                  onClick={() =>
                    window.open("https://mfl-coach.com/match-analysis")
                  }
                >
                  Visit Coach!
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PageToolsMatchObservatory;
