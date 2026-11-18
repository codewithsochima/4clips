
import { useCallback, useRef, useState } from "react";

export const API_BASE = "http://localhost:5000";

export function useClipCreate(filename) {
  const [state, setState] = useState({
    status: "idle",
    clip: null,
    error: null,
  });

  const busy = useRef(false);

  const create = useCallback(
    async ({ startTime, duration }) => {
      if (busy.current || !filename) return;

      if (
        !Number.isFinite(startTime) ||
        !Number.isFinite(duration) ||
        startTime < 0 ||
        duration < 1
      ) {
        setState({
          status: "error",
          clip: null,
          error: "Please provide a valid start time and clip duration.",
        });
        return;
      }

      busy.current = true;

      setState({
        status: "processing",
        clip: null,
        error: null,
      });

      try {
        const response = await fetch(`${API_BASE}/api/clips/create`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            filename,
            startTime,
            duration,
          }),
        });

        let body = null;

        try {
          body = await response.json();
        } catch {
          // The server did not return valid JSON.
        }

        if (
          response.ok &&
          body?.success &&
          body.clip?.downloadUrl
        ) {
          const url = new URL(
            body.clip.downloadUrl,
            API_BASE
          ).href;

          setState({
            status: "success",
            clip: {
              ...body.clip,
              url,
            },
            error: null,
          });
        } else {
          setState({
            status: "error",
            clip: null,
            error:
              body?.error ||
              body?.message ||
              `Clip creation failed (HTTP ${response.status}).`,
          });
        }
      } catch {
        setState({
          status: "error",
          clip: null,
          error:
            "Couldn't reach the server. Check that the backend is running on localhost:5000.",
        });
      } finally {
        busy.current = false;
      }
    },
    [filename]
  );

  const reset = useCallback(() => {
    if (busy.current) return;

    setState({
      status: "idle",
      clip: null,
      error: null,
    });
  }, []);

  return {
    ...state,
    create,
    reset,
  };
}
