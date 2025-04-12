
export const verifyServiceData = (service) => {
	if (!service?.data?.nonce)
		return "Missing element in the service: nonce";
	if (!service?.data?.address)
		return "Missing element in the service: wallet address";
	if (!service?.data?.signatures)
		return "Missing element in the service: wallet signature";

	return null;
}