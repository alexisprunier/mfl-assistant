import React, { useState, useEffect } from 'react';
import { NotificationManager as nm } from "react-notifications";
import ButtonLogin from "components/buttons/ButtonLogin.js";
import BoxLogin from "components/box/BoxLogin.js";
import LoadingSquare from "components/loading/LoadingSquare.js";
import BoxMessage from "components/box/BoxMessage.js";
import UtilConditionalRender from "components/utils/UtilConditionalRender.js";
import PopupNotificationScope from "components/popups/PopupNotificationScope.js";
import ItemNotificationScope from "components/items/ItemNotificationScope.js";
import ItemNotification from "components/items/ItemNotification.js";
import ItemPlayer from "components/items/ItemPlayer.js";
import { getReportConfigurations, addReportConfiguration, deleteReportConfiguration, updateReportConfiguration } from "services/api-assistant.js";
import { validateEmail } from "utils/re.js";

interface PageNotificationReportProps {}

const PageNotificationReport: React.FC < PageNotificationReportProps > = (props) => {
  const [reportConfigurations, setReportConfigurations] = useState(null);

  const fetchReportConfigurations = () => {
    getReportConfigurations({
      handleSuccess: (v) => {
        setReportConfigurations(v.data.getReportConfigurations);
      },
    });
  }

  const addOrDeleteReportConfiguration = (c) => {
    if (!c) {
      addReportConfiguration({
        handleSuccess: (v) => {
          nm.info("The report has been activated");
          fetchReportConfigurations();
        },
        params: {
          type: "daily_progress_report",
          time: "21:54",
        },
      });
    } else {
      deleteReportConfiguration({
        handleSuccess: (v) => {
          if (v.errors) {
            nm.warning("Error while deactivating the report");
          } else {
            nm.info("The report has been deactivated");
            fetchReportConfigurations();
          }
        },
        params: {
          id: c.id,
        },
      });
    }
  }

  const modifyReportConfiguration = (id, params) => {
    console.log(id, params);
    updateReportConfiguration({
      handleSuccess: (v) => {
        nm.info("The report has been updated");
        fetchReportConfigurations();
      },
      params: {
        id: id,
        ...params,
      },
    });
  }

  useEffect(() => {
    if (props.assistantUser) {
      fetchReportConfigurations();
    }
  }, [props.assistantUser]);

  useEffect(() => {
    if (props.assistantUser) {
      fetchReportConfigurations();
    }
  }, []);

  return (
    <div id="PageNotificationReport" className="h-100 w-100">
      <div className="container max-width-md h-100 px-2 px-md-4 py-4">
        <div className="d-flex flex-column h-100 w-100 fade-in">
          <div className="card d-flex flex-column flex-md-grow-0 m-2 p-3 pt-2">
            <div className="d-flex flex-row mb-2">
              <h4 className="flex-grow-1">Daily report</h4>
            </div>

            <div className="d-flex">
              {reportConfigurations !== null
                ? <div>
                  <input
                    type="checkbox"
                    className="me-1 mb-2"
                    defaultChecked={reportConfigurations.filter((c) => c.type === "daily_progress_report").length > 0}
                    onClick={() => addOrDeleteReportConfiguration(
                      reportConfigurations.filter((c) => c.type === "daily_progress_report").pop()
                    )}
                  />
                  <span className="text-info">
                    <i class="bi bi-cone-striped me-1"></i>BETA:
                  </span>
                  &nbsp;Activate the 24H progression report
                  {reportConfigurations.filter((c) => c.type === "daily_progress_report").length > 0
                    && <div className="ms-4 fade-in">
                      Choose time (UTC): <input
                        type="time"
                        className="form-control"
                        defaultValue={reportConfigurations.filter((c) => c.type === "daily_progress_report").pop().time}
                        onBlur={(v) => modifyReportConfiguration(
                          reportConfigurations.filter((c) => c.type === "daily_progress_report").pop().id,
                          { time: v.target.value }
                        )}
                      />
                    </div>
                  }
                </div>
                : <div className="w-100" style={{ height: "300px" }}>
                  <LoadingSquare />
                </div>
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PageNotificationReport;