import { makeStyles } from "@material-ui/core/styles";

export const useGlobalStyles = makeStyles((theme) => ({
  button: {
    margin: theme.spacing(1),
  },
}));

function messageSW(sw: ServiceWorker, data: { type: string }) {
  return new Promise((resolve) => {
    const messageChannel = new MessageChannel();
    messageChannel.port1.onmessage = (event) => {
      resolve(event.data);
    };
    sw.postMessage(data, [messageChannel.port2]);
  });
}
export { messageSW };

export async function getNotificationToken(): Promise<any> {
  try {
    const sw = (await navigator.serviceWorker?.ready).active;
    if (sw === null) throw new Error("No service worker registered :(");
    const token = await messageSW(sw, {
      type: "GET_NOTIFICATION_TOKEN",
    });
    return token;
  } catch (e) {
    console.error("Error ocurred while getting notification token\n", e);
    return null;
  }
}
