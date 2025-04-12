import React from "react";

interface ControllerAgeProps {
  minAge?: int;
  maxAge?: int;
  onChange: func;
}

const ControllerAge: React.FC<ControllerAgeProps> = ({
  minAge,
  maxAge,
  onChange,
}) => {
  return (
    <div className="row">
      <div className="col-12 mb-1">
        <h4>Age</h4>
      </div>
      <div className="col-6">
        <label htmlFor="minAge">Min</label>
        <select
          className="form-control w-100 text-white"
          value={minAge ? minAge.toString() : null}
          onChange={(v) =>
            onChange(
              v.target.value ? parseInt(v.target.value) : undefined,
              maxAge
            )
          }
        >
          <option value={""} key={null} />
          {Array.from(
            { length: Math.min(40, maxAge ? maxAge : 40) - 15 + 1 },
            (_, i) => 15 + i
          ).map((p) => (
            <option value={p.toString()} key={p.toString()}>
              {p}
            </option>
          ))}
        </select>
      </div>
      <div className="col-6">
        <label htmlFor="maxAge">Max</label>
        <select
          className="form-control w-100 text-white"
          value={maxAge ? maxAge.toString() : null}
          onChange={(v) =>
            onChange(
              minAge,
              v.target.value ? parseInt(v.target.value) : undefined
            )
          }
        >
          <option value={""} key={null} />
          {Array.from(
            { length: 40 - Math.max(30, minAge ? minAge : 15) + 1 },
            (_, i) => Math.max(15, minAge ? minAge : 15) + i
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

export default ControllerAge;
