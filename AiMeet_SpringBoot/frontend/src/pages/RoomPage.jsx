import React, { useEffect, useRef } from "react";
import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";
import { useParams } from "react-router-dom";

function RoomPage() {
  const { roomId } = useParams();
  const meetingRef = useRef(null);

  useEffect(() => {
    const myMeeting = async () => {
      const appID = 345513070;
      const serverSecret = "82eb82e3c4c89e68d55d2ce09d93fa28";

      const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
        appID,
        serverSecret,
        roomId,
        Date.now().toString(),
        "parinith"
      );

      const zc = ZegoUIKitPrebuilt.create(kitToken);

      zc.joinRoom({
        container: meetingRef.current,
        scenario: {
          mode: ZegoUIKitPrebuilt.VideoConference,
        },
        showScreenSharingButton: true, // Optional feature
      });
    };

    if (meetingRef.current) {
      myMeeting();
    }
  }, [roomId]);

  return (
    <div className="room-page">
      <div ref={meetingRef} style={{ width: "100%", height: "100vh" }} />
    </div>
  );
}

export default RoomPage;
