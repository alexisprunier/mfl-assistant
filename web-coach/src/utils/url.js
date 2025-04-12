
export function convertDictToUrlParams(dict) {
	let args = "";

	if (dict !== null) {
		Object.keys(dict).forEach((key) => {
			if (typeof dict[key] === "boolean") {
				args += `${key}=${dict[key]}&`;
			} else if (typeof dict[key] === "string" && dict[key].length > 0) {
				args += `${key}=${dict[key]}&`;
			} else if (Array.isArray(dict[key]) && dict[key].length > 0) {
				args += `${key}=${dict[key].join(",")}&`;
			} else if (Number.isInteger(dict[key])) {
				args += `${key}=${dict[key]}&`;
			}
		});
	}

	return args;
}
