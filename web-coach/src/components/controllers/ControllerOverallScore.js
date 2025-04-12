import React from "react";

interface ControllerOverallScoreProps {
  minOvr?: int;
  maxOvr?: int;
  onChange: func;
}

const ControllerOverallScore: React.FC<ControllerOverallScoreProps> = ({
  minOvr,
  maxOvr,
  onChange,
}) => {
  return (
    <div className="row">
      <div className="col-12 mb-1">
        <h4>Overall</h4>
      </div>
      <div className="col-6">
        <label htmlFor="minOvr">Min</label>
        <select
          className="form-control w-100 text-white"
          value={minOvr ? minOvr.toString() : null}
          onChange={(v) =>
            onChange(
              v.target.value ? parseInt(v.target.value) : undefined,
              maxOvr
            )
          }
        >
          <option value={""} key={null} />
          {Array.from(
            { length: Math.min(99, maxOvr ? maxOvr : 99) - 30 + 1 },
            (_, i) => 30 + i
          ).map((p) => (
            <option value={p.toString()} key={p.toString()}>
              {p}
            </option>
          ))}
        </select>
      </div>
      <div className="col-6">
        <label htmlFor="maxOvr">Max</label>
        <select
          className="form-control w-100 text-white"
          value={maxOvr ? maxOvr.toString() : null}
          onChange={(v) =>
            onChange(
              minOvr,
              v.target.value ? parseInt(v.target.value) : undefined
            )
          }
        >
          <option value={""} key={null} />
          {Array.from(
            { length: 99 - Math.max(30, minOvr ? minOvr : 30) + 1 },
            (_, i) => Math.max(30, minOvr ? minOvr : 30) + i
          ).map((p) => (
            <option value={p.toString()} key={p.toString()}>
              {p}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default ControllerOverallScore;
