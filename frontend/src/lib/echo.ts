import axiosInstance from "@/lib/axios-instance";
import { EchoOptions } from "laravel-echo";

export const echoOptions: EchoOptions<"reverb"> = {
  broadcaster: "reverb",
  key: process.env.NEXT_PUBLIC_REVERB_APP_KEY,
  authorizer: channel => {
    return {
      authorize: (socketId, callback) => {
        axiosInstance
          .post("/broadcasting/auth", {
            socket_id: socketId,
            channel_name: channel.name,
          })
          .then(response => {
            callback(null, response.data);
          })
          .catch(error => {
            callback(error, null);
          });
      },
    };
  },
  wsHost: process.env.NEXT_PUBLIC_REVERB_HOST,
  wsPort: Number(process.env.NEXT_PUBLIC_REVERB_PORT) ?? 80,
  wssPort: Number(process.env.NEXT_PUBLIC_REVERB_PORT) ?? 443,
  forceTLS: (process.env.NEXT_PUBLIC_REVERB_SCHEME ?? "https") === "https",
  enabledTransports: ["ws", "wss"],
  withCredentials: true,
};
