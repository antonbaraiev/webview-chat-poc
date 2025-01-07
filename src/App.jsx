import { useState } from "react";
import { createAxios, useV3JoinFlow } from "@dazn/public-watch-party-join-flow";
import { useAuthToken } from "./hooks/useAuthToken";
import { pubnubPublishHelper } from "./utils/loadDaznObject";
import { ChatContainer } from "@dazn/pwp-chat-web";

const ROOM_ID = "00006777-c330-6e64-c09e-cdbb9481aa1a";
const TOKEN =
  "eyJhbGciOiJSUzUxMiIsInR5cCI6IkpXVCIsImtpZCI6InE0akNLajFtUlE0V2ktSC1FVWY0RExaZWQ1RDNFNnRmMEt2QllzR2JCeGMifQ.eyJ1c2VyIjoiOTg1NjUzZjQtM2VjNi00ODg4LWJkOTItZGE0MzdiY2RhY2NjIiwiZmlyc3ROYW1lIjoiYW50b24tc3RhZy1kYXpuLWdlcm1hbnkiLCJpc3N1ZWQiOjE3MzYyMzgyNDEsInVzZXJzdGF0dXMiOiJBY3RpdmVQYWlkIiwic291cmNlVHlwZSI6IiIsInByb2R1Y3RTdGF0dXMiOnsiVGVubmlzVFYiOiJQYXJ0aWFsIiwiRklCQSI6IlBhcnRpYWwiLCJMaWdhU2VndW5kYSI6IlBhcnRpYWwiLCJORkwiOiJQYXJ0aWFsIiwiUmFsbHlUViI6IlBhcnRpYWwiLCJQR0EiOiJQYXJ0aWFsIiwiREFaTiI6IkFjdGl2ZVBhaWQifSwidmlld2VySWQiOiJkYTQzN2JjZGFjY2MiLCJjb3VudHJ5IjoiZGUiLCJjb250ZW50Q291bnRyeSI6ImRlIiwibGFuZ3VhZ2UiOiJlbiIsImlzUHVyY2hhc2FibGUiOnRydWUsImhvbWVDb3VudHJ5IjoiZGUiLCJ1c2VyVHlwZSI6MywiZGV2aWNlSWQiOiI5ODU2NTNmNC0zZWM2LTQ4ODgtYmQ5Mi1kYTQzN2JjZGFjY2MtMDA2MWNmYWI5NCIsImlzRGV2aWNlUGxheWFibGUiOnRydWUsInBsYXlhYmxlRWxpZ2liaWxpdHlTdGF0dXMiOiJQTEFZQUJMRSIsImNhbnJlZGVlbWdjIjoiRW5hYmxlZCIsImp0aSI6IjIwNmIzYTVlLTRjZmUtNDQ4Zi1hMzhhLTViN2RhNjliMmYzNyIsImlkcFR5cGUiOiJpZHAtcGFzc3dvcmQiLCJwcm92aWRlck5hbWUiOiJkYXpuIiwicHJvdmlkZXJDdXN0b21lcklkIjoiZDI4NmEwNzQtZmZmZC00NjRhLTg5MjgtYTg5NjMzMjFlOGRmIiwiZW50aXRsZW1lbnRzIjp7ImVudGl0bGVtZW50U2V0cyI6W3siaWQiOiJ0aWVyX2dvbGRfZGUiLCJwcm9kdWN0R3JvdXAiOiJEQVpOIiwicHJvZHVjdFR5cGUiOiJ0aWVyIiwiZW50aXRsZW1lbnRzIjpbImVudGl0bGVtZW50X211bHRpcGxlX2RldmljZXNfOTk5IiwiZW50aXRsZW1lbnRfYWxsb3dfd2F0Y2hfY29uY3VycmVuY3lfd2l0aF9zaW5nbGVfbG9jYXRpb24iLCJlX3N1cGVyX3Nwb3J0X2RlIiwiZV9zaWx2ZXJfZGUiLCJlX2Jyb256ZV9kZSIsImVfYnJvbnplX3N1cGVyX2RlIiwiZV9icm9uemVfYXJ0X2RlIiwiZV9zaWx2ZXJfYXJ0X2RlIiwiZV9icm9uemVfZml4X2RlIiwiZV9zaWx2ZXJfc3VwZXJfZGUiLCJlX3NlcmllYV9sZWFndWVfZGFjaF9jb21wdCIsImVfYnJvbnplX3N1cGVyX3NpbHZlcl9kZSIsImVfcHJvbW9fZGUiLCJlX3Byb21vX2FydGljbGVfZGUiLCJiYXNlX2Rhem5fY29udGVudCIsImVfYXJ0X3VubGltaXRlZF9jaCJdfV0sImZlYXR1cmVzIjp7IkNPTkNVUlJFTkNZIjp7Im1heF9pcHMiOjEsIm1heF9kZXZpY2VzIjoyfSwiREVWSUNFIjp7ImFjY2Vzc19kZXZpY2UiOiJhbnkiLCJtYXhfcmVnaXN0ZXJlZF9kZXZpY2VzIjo5OTl9fX0sImxpbmtlZFNvY2lhbFBhcnRuZXJzIjpbXSwiZXhwIjoxNzM2MjQ1NDQxLCJpc3MiOiJodHRwczovL2F1dGguYXIuZGF6bi1zdGFnZS5jb20ifQ.niKDojxhmTpUflbqx69-SFU3UYsJ1h9hUgnmi2-yVeyEbz1qH9cyoSygvNB5DmGDpRfTjysfKOr9tmj-vEC3jDe5CSF5YvavYgypYeyUnDSlqKjfxBg5-RqIaj80oQwKU-AAHpw_3GEhOTso09dNzfHmb9OvJe3Kv2OmMO7zzxaiDzj075eGrGLc7521auXLjbb8R9EYFG7smKhKygC57e-CK-HC-W8F-6zshxJViGoD-wdjqa8sQ61OXuDR3uHRO0XpjLIhBTRiI48WJItOP8SSISv30oDF0r2jQtOEpB8EiBAJcoJZXOYrOUaMp3yL2Zp-pJwRjdnqdP9GmP0P5w";

const axiosInstance = createAxios();
axiosInstance.defaults.headers.common = { Authorization: `Bearer ${TOKEN}` };

function App() {
  const [userNickname, setUserNickname] = useState();
  const [isError, setIsError] = useState();

  const roomId = ROOM_ID;
  const authToken = TOKEN;

  const { userUUid, deviceId, isAuthTokenValid } = useAuthToken(authToken);

  const [
    {
      pubnubInstanceV3,
      tokenV3: messengerToken,
      ntpOffset,
      roomState,
      messengerState,
    },
  ] = useV3JoinFlow({
    userUUid,
    axiosInstance,
    roomId,
    deviceId,
    isModerator: false,
    isV3: true,
    isLR: false,
    setUserNickname,
    updateError: setIsError,
    userPassedInternalPartyCheck: true,
  });

  const isUserBlocked = messengerState
    ? messengerState?.userState !== "UNBLOCKED"
    : false;

  if (
    !userUUid ||
    !userUUid ||
    !isAuthTokenValid ||
    !pubnubInstanceV3 ||
    !messengerToken
  ) {
    return (
      <div
        style={{
          width: "100vw",
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {isError ? "Something went wrong" : "LOADING..."}
      </div>
    );
  }

  pubnubPublishHelper(pubnubInstanceV3, roomId);

  return (
    <div style={{ boxSizing: "border-box", width: "100vw", height: "100vh" }}>
      <ChatContainer
        pubnubInstance={pubnubInstanceV3}
        pwpAuthToken={TOKEN}
        // chatTabActivatedTimestamp={publicWPTabActivatedTimestamp}
        hasErrorOccured={isError}
        roomId={roomId}
        userId={"985653f4-3ec6-4888-bd92-da437bcdaccc"}
        eventId={"3tshicdlhtmntj5zhou75xbed"}
        deviceId={deviceId}
        isModeratorUser={false}
        isBlocked={isUserBlocked}
        syncStatus={"SYNCED"}
        roomState={roomState?.state}
        isDebugMode={true}
        ntpOffset={ntpOffset}
        userDisplayName={userNickname}
        // SaveFirstPartyDataRequest={saveFPDRequest}
        optimizelyParams={{
          isGenderVisible: false,
          isAgeVisible: false,
          isPinnedMessageVisible: true,
          pinnedMessageExpandedDuration: 2000,
          isMessageTimestampVisible: true,
          isPollVisible: true,
          isQuizzesVisible: true,
          isLeaderboardVisible: true,
          pollFinishedCollapsedDelay: 3000,
          pollFinishedDismissDelay: 3000,
          isReactionsFeatureEnabled: true,
          isPromotionLinksV2Enabled: true,
          reactionsMaxCount: 15,
          reactionsSpreadLimit: 600,
          leaderboardLoadingTimeoutMs: 3000,
          leaderboardLoadingTimeoutRandomDelayMaxMs: 1000,
          maxUsersShownInLeaderboard: 50,
          maxHistoryMessages: 200,
          msgMaxCharacters: 60,
          isImagesFeatureEnabled: true,
          isEngagementBreaksFeatureEnabled: true,
          isGamificationFeatureEnabled: true,
        }}
        channels={{
          messenger_moderator: `messenger_moderator.${roomId}`,
          messenger: `messenger.${roomId}`,
          pinned_messages: `pinned_messages.${roomId}`,
          reports: `reports.${roomId}`,
          reactions: `reactions.${roomId}`,
          polls: `polls.${roomId}`,
          quizzes: `quizzes.${roomId}`,
          quizzes_answers: `quizzes_answers.${roomId}`,
          polls_votes: `polls_votes.${roomId}`,
          sponsorship: `sponsorship.${roomId}`,
          messenger_images: `messenger_images.${roomId}`,
          breaks: `breaks.${roomId}`,
          fans_battles: `battles.${roomId}`,
        }}
        isRtl={false}
        isSponsorshipPartyType={roomState?.partyType.endsWith("SPONSORSHIP")}
      />
    </div>
  );
}

export default App;
