import { NotificationManager as nm } from "react-notifications";


export const copyTextToClipboard = (textToCopy) => {
  try {
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(textToCopy);
      nm.info("Copied to clipboard");
    }
  } catch (err) {
    console.error(err);
  }
}