import { DAZN } from "./dazn";
import * as Pubnub from "pubnub";

// @ts-ignore
if (!window?.dazn) {
  // @ts-ignore
  window.dazn = DAZN;
}

localStorage.setItem("public_watch_party_developer", "true");

const normalLog = window.console.log;

window.console.log = (...props) => {
  normalLog(...props);

  let value = "";
  [].forEach.call(props, (p) => (value += JSON.stringify(p)));

  // @ts-ignore
  return window?.webkit?.messageHandlers?.bridgeHandler?.postMessage({
    key: "bridgeHandler",
    value,
  });
};

export const pubnubPublishHelper = (
  pubnubInstanceV3: Pubnub,
  roomId: string,
) => {
  const randomText =
    "Finished her are its honoured drawings nor. Pretty see mutual thrown all not edward ten. Particular an boisterous up he reasonably frequently. Several any had enjoyed shewing studied two. Up intention remainder sportsmen behaviour ye happiness. Few again any alone style added abode ask. Nay projecting unpleasing boisterous eat discovered solicitude. Own six moments produce elderly pasture far arrival".split(
      " ",
    );
  const reactions = [
    "smiling_face",
    "clapping_hands",
    "fingers_crossed",
    "crying_face",
    "thumbs_down",
  ];
  const gifs = ["TlxuVO7EqEqnlg8xW4"];

  // @ts-ignore
  window.PN = {
    publishMessages: async (amountToPublish = 1000, intervalMs = 500) => {
      for (let count = 0; count < amountToPublish; count++) {
        const content =
          Math.random() > 0.5
            ? {
                text: `${randomText[Math.floor(Math.random() * randomText.length)]}`,
              }
            : { giphyId: gifs[0] };

        await new Promise((resolve) => {
          setTimeout(() => {
            pubnubInstanceV3.publish(
              {
                channel: `messenger.${roomId}`,
                message: {
                  messageId: `${Date.now()}_${count}`,
                  nickname: "MessagesSender",
                  ...content,
                },
              },
              (resp) => {
                if (resp?.error) {
                  console.error("[ Message publishing error ]", resp);
                }
                resolve(true);
              },
            );
          }, intervalMs);
        });
      }
    },
    publishReactions: async (amountToPublish = 1000, intervalMs = 500) => {
      for (let count = 0; count < amountToPublish; count++) {
        await new Promise((resolve) => {
          setTimeout(() => {
            pubnubInstanceV3.publish(
              {
                channel: `reactions.${roomId}`,
                message: {
                  reactionId:
                    reactions[Math.floor(Math.random() * reactions.length)],
                },
              },
              (resp) => {
                if (resp?.error) {
                  console.error("[ Reaction publishing error ]", resp);
                }
                resolve(true);
              },
            );
          }, intervalMs);
        });
      }
    },
  };
};

export default {};
