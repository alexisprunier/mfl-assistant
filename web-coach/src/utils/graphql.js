export function jsonToParams(params) {
  var paramString = "";

  Object.keys(params).forEach((k) => {
    if (params[k] !== undefined) {
      if (params[k] !== null) {
        if (paramString.length > 0) {
          paramString += ",";
        }

        paramString += `${k}: `;

        if (!Array.isArray(params[k])) {
          if (typeof params[k] === "number" || typeof params[k] === "boolean") {
            paramString += params[k];
          } else {
            paramString += `"${params[k]}"`;
          }
        } else {
          if (params[k].length === 0) {
            paramString += `[]`;
          } else if (typeof params[k][0] === "number") {
            paramString += `[${params[k].join(",")}]`;
          } else {
            paramString += `["${params[k].join('","')}"]`;
          }
        }
      }

      if (params[k] === null) {
        if (paramString.length > 0) {
          paramString += ",";
        }

        paramString += `${k}: ${null}`;
      }
    }
  })

  return paramString;
}

export function prettifyId(id) {
  if (id && id.length === 24) {
    return id.slice(0, 2) + "..." + id.slice(-5);
  }

  return "None";
}