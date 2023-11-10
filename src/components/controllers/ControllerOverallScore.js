import React from 'react';

interface ControllerOverallScoreProps {
  overallMin?: int;
  overallMax?: int;
  onChange: func;
}

const ControllerOverallScore: React.FC<ControllerOverallScoreProps> = ({ overallMin, overallMax, onChange }) => {
  
  const getOverallScoreTextValue = () => {
    if (overallMin || overallMax) {
      let text = "";

      text += overallMin || "-∞"
      text += " -> ";
      text += overallMax || "∞"

      return text;
    }

    return "All";
  }

  return (
    <div className="row">
      <div className="col-12 mb-3">
        <h4>Overall score</h4>
      </div>
      <div className="col-12 text-center text-white">
        <h3>{getOverallScoreTextValue()}</h3>
      </div>
      <div className="col">
        <div>Minimum overall score</div>

    	  <input
          className="w-100"
          type="range"
          value={overallMin || 45}
          min="45"
          max={Math.min(94, overallMax)}
          step="1"
          onTouchEnd={(v) => onChange(v.target.value, overallMax)}
        >
        </input>

        <div>Maximum overall score</div>

        <input
          className="w-100 text-primary bg-dark"
          type="range"
          value={overallMax || 94}
          min={Math.max(45, overallMin)}
          max="94"
          step="1"
          onTouchEnd={(v) => onChange(overallMin, v.target.value)}
        >
        </input>
      </div>
    </div>
  );
};

export default ControllerOverallScore;