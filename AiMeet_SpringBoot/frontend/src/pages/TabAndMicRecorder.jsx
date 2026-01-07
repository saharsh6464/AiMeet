import React, { useCallback, useEffect, useRef, useState } from "react";

export default function TabAndMicRecorder({
  micGain = 1.0,
  tabGain = 1.0,
  preferredMimeType = "audio/webm;codecs=opus",
}) {
  const [recording, setRecording] = useState(false);
  const [audioURL, setAudioURL] = useState(null);
  const [error, setError] = useState(null);

  const micStreamRef = useRef(null);
  const tabStreamRef = useRef(null);
  const mixedStreamRef = useRef(null);

  const audioContextRef = useRef(null);
  const destRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);

  useEffect(() => {
    return () => stopAll();
  }, []);

  const pickMimeType = () => {
    const candidates = [
      preferredMimeType,
      "audio/webm;codecs=opus",
      "audio/webm",
      "audio/mp4",
      "audio/ogg;codecs=opus",
      "audio/ogg",
    ];

    for (const t of candidates) {
      if (MediaRecorder.isTypeSupported(t)) return t;
    }
    return ""; // let browser decide
  };

  const start = useCallback(async () => {
    setError(null);
    setAudioURL(null);

    try {
      // 1) Get mic
      const mic = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
        video: false,
      });
      micStreamRef.current = mic;

      // 2) Get tab audio (user must pick "This Tab" + "Share tab audio")
      const tab = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: {
          channelCount: 2,
          sampleRate: 48000,
        },
      });
      tabStreamRef.current = tab;

      // 3) Mix with Web Audio API
      const AC = window.AudioContext || window.webkitAudioContext;
      const ac = new AC();
      audioContextRef.current = ac;

      if (ac.state === "suspended") {
        await ac.resume();
      }

      const destination = ac.createMediaStreamDestination();
      destRef.current = destination;

      const micSource = ac.createMediaStreamSource(mic);
      const tabSource = ac.createMediaStreamSource(tab);

      const micGainNode = ac.createGain();
      micGainNode.gain.value = micGain;

      const tabGainNode = ac.createGain();
      tabGainNode.gain.value = tabGain;

      const compressor = ac.createDynamicsCompressor();

      micSource.connect(micGainNode).connect(compressor);
      tabSource.connect(tabGainNode).connect(compressor);
      compressor.connect(destination);

      const mixed = destination.stream;
      mixedStreamRef.current = mixed;

      // 4) Record mixed stream
      const mimeType = pickMimeType();
      const mr = new MediaRecorder(mixed, mimeType ? { mimeType } : undefined);
      mediaRecorderRef.current = mr;
      chunksRef.current = [];

      mr.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) chunksRef.current.push(e.data);
      };
      mr.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: mr.mimeType || "audio/webm" });
        const url = URL.createObjectURL(blob);
        setAudioURL(url);
      };

      mr.start();
      setRecording(true);
    } catch (err) {
      console.error(err);
      setError(err.message || String(err));
      stopAll();
    }
  }, [micGain, tabGain, preferredMimeType]);

  const stopAll = useCallback(() => {
    setRecording(false);

    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      mediaRecorderRef.current.stop();
    }

    const stopStream = (s) => {
      if (!s) return;
      s.getTracks().forEach((t) => {
        try {
          t.stop();
        } catch (e) {}
      });
    };

    stopStream(micStreamRef.current);
    stopStream(tabStreamRef.current);

    if (audioContextRef.current && audioContextRef.current.state !== "closed") {
      audioContextRef.current.close();
    }
  }, []);

  const download = useCallback(() => {
    if (!audioURL || !mediaRecorderRef.current) return;
    const a = document.createElement("a");
    a.href = audioURL;
    const mime = mediaRecorderRef.current.mimeType;
    const ext = mime.includes("mp4")
      ? "m4a"
      : mime.includes("ogg")
      ? "ogg"
      : "webm";
    a.download = `tab-and-mic.${ext}`;
    a.click();
  }, [audioURL]);

  return (
    <div style={{ fontFamily: "system-ui", lineHeight: 1.4, maxWidth: 560 }}>
      <h3>Tab + Mic Recorder</h3>
      <p style={{ marginTop: 0 }}>
        Captures your microphone and this tab’s audio together, mixes them into one file.
      </p>

      {!recording ? (
        <button onClick={start}>Start capture</button>
      ) : (
        <button onClick={stopAll}>Stop & save</button>
      )}

      {error && <p style={{ color: "crimson" }}>{error}</p>}

      {audioURL && (
        <div style={{ marginTop: 12 }}>
          <audio controls src={audioURL} />
          <div style={{ marginTop: 8 }}>
            <button onClick={download}>Download</button>
          </div>
        </div>
      )}
    </div>
  );
}
