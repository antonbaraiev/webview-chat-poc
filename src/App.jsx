import { useState } from "react";
import { createAxios, useV3JoinFlow } from "@dazn/public-watch-party-join-flow";
import { useAuthToken } from "./hooks/useAuthToken";
import { pubnubPublishHelper } from "./utils/loadDaznObject";
import { ChatContainer } from "@dazn/pwp-chat-web";
import { useSearchParams, BrowserRouter, Routes, Route } from "react-router";
import "whatwg-fetch";

const ROOM_ID = "00006791-e1e8-d93b-c819-54addef878f5";
const TOKEN = "";

const axiosInstance = createAxios();

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Chat />} />
      </Routes>
    </BrowserRouter>
  );
}

function Chat() {
  const [userNickname, setUserNickname] = useState();
  const [isError, setIsError] = useState();

  const [searchParams] = useSearchParams();

  const roomId = searchParams.get("roomId") || ROOM_ID;
  const authToken = searchParams.get("token") || TOKEN;
  axiosInstance.defaults.headers.common = {
    Authorization: `Bearer ${authToken}`,
  };

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
    isDAZNXBE: true,
  });

  const isUserBlocked = messengerState
    ? messengerState?.userState !== "UNBLOCKED"
    : false;

  if (!userUUid || !isAuthTokenValid || !pubnubInstanceV3) {
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
        pwpAuthToken={authToken}
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
          isDaznxBeEnabled: true,
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
