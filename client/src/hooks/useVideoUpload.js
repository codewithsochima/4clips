
import { useCallback, useRef, useState } from "react";
import { validateVideo } from "../lib/format";

const UPLOAD_URL = "http://localhost:5000/api/videos/upload";

export function useVideoUpload() {
  const [state, setState] = useState({
    status: "idle",
    file: null,
    progress: 0,
    result: null,
    error: null,
    canRetry: false,
  });

  const xhrRef = useRef(null);

  const select = useCallback((file) => {
    if (!file) return;

    const problem = validateVideo(file);

    setState(
      problem
        ? {
            status: "error",
            file,
            progress: 0,
            result: null,
            error: problem,
            canRetry: false,
          }
        : {
            status: "selected",
            file,
            progress: 0,
            result: null,
            error: null,
            canRetry: false,
          }
    );
  }, []);

  const reset = useCallback(() => {
    xhrRef.current?.abort();
    xhrRef.current = null;

    setState({
      status: "idle",
      file: null,
      progress: 0,
      result: null,
      error: null,
      canRetry: false,
    });
  }, []);

  const upload = useCallback(() => {
    const file = state.file;

    if (!file || state.status === "uploading") return;

    const xhr = new XMLHttpRequest();
    xhrRef.current = xhr;

    const form = new FormData();
    form.append("video", file);

    const fail = (error) => {
      if (xhrRef.current !== xhr) return;

      xhrRef.current = null;

      setState((s) => ({
        ...s,
        status: "error",
        error,
        canRetry: true,
      }));
    };

    xhr.upload.onprogress = (e) => {
      if (xhrRef.current !== xhr) return;

      if (e.lengthComputable) {
        setState((s) => ({
          ...s,
          progress: e.loaded / e.total,
        }));
      }
    };

    xhr.onload = () => {
      if (xhrRef.current !== xhr) return;

      let body = null;

      try {
        body = JSON.parse(xhr.responseText);
      } catch {
        // The server did not return valid JSON.
      }

      if (xhr.status >= 200 && xhr.status < 300 && body?.success) {
        xhrRef.current = null;

        setState((s) => ({
          ...s,
          status: "success",
          progress: 1,
          result: body.video ?? body,
          canRetry: false,
        }));
      } else {
        fail(
          body?.message ||
          `Upload failed (HTTP ${xhr.status}).`
        );
      }
    };

    xhr.onerror = () => {
      fail(
        "Couldn't reach the server. Check that the backend is running on localhost:5000."
      );
    };

    xhr.onabort = () => {
      if (xhrRef.current === xhr) {
        xhrRef.current = null;
      }
    };

    setState((s) => ({
      ...s,
      status: "uploading",
      progress: 0,
      error: null,
      canRetry: false,
    }));

    xhr.open("POST", UPLOAD_URL);
    xhr.send(form);
  }, [state.file, state.status]);

  return {
    ...state,
    select,
    upload,
    reset,
  };
}
