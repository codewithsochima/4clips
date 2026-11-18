
import { useCallback, useState } from "react";

const TRANSCRIPTION_URL =
  "http://localhost:5000/api/transcription/transcribe";

export function useTranscription() {
  const [status, setStatus] = useState("idle");
  const [transcript, setTranscript] = useState(null);
  const [error, setError] = useState(null);

  const transcribe = useCallback(async (filename) => {
    if (!filename || status === "processing") return;

    setStatus("processing");
    setTranscript(null);
    setError(null);

    try {
      const response = await fetch(TRANSCRIPTION_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ filename }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Video transcription failed."
        );
      }

      setTranscript(data.transcript);
      setStatus("success");

    } catch (err) {
      setError(
        err.message || "Could not connect to the transcription server."
      );
      setStatus("error");
    }
  }, [status]);

  const reset = useCallback(() => {
    setStatus("idle");
    setTranscript(null);
    setError(null);
  }, []);

  return {
    status,
    transcript,
    error,
    transcribe,
    reset,
  };
}
