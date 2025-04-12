
export const shortenHex = (hexStr) => {
    if (!hexStr || hexStr.length < 6) {
        return "";
    }
    const firstPart = hexStr.slice(0, 3);
    const lastPart = hexStr.slice(-2);
    return `${firstPart}...${lastPart}`;
}