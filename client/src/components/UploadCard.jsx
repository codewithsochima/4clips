
import Dropzone from "./Dropzone";
import UploadResult from "./UploadResult";
import Icon from "./Icon";
import { formatBytes } from "../lib/format";

export default function UploadCard({ u, onContinue }) {
  const {
    status,
    file,
    progress,
    error,
    result,
    canRetry,
  } = u;

  const pct = Math.round(progress * 100);

  if (status === "success") {
    return (
      <UploadResult
        result={result}
        file={file}
        onReset={u.reset}
        onContinue={onContinue}
      />
    );
  }

  // A rejected file shows the empty dropzone again.
  const showFile =
    file && !(status === "error" && !canRetry);

  return (
    <section
      aria-labelledby="upload-title"
      className="w-full rounded-2xl border border-line bg-panel p-3 sm:p-4"
    >
      <h2 id="upload-title" className="sr-only">
        Upload a video
      </h2>

      <Dropzone
        file={showFile ? file : null}
        onSelect={u.select}
        onClear={u.reset}
        disabled={status === "uploading"}
      />

      {status === "error" && (
        <div
          role="alert"
          className="mt-3 flex gap-3 rounded-xl border border-danger/30 bg-danger/10 p-3 text-sm"
        >
          <Icon
            name="alert"
            className="mt-0.5 size-5 shrink-0 text-danger"
          />

          <div>
            <p className="font-medium text-danger">
              Upload failed
            </p>

            <p className="mt-0.5 text-white/80">
              {error}
            </p>
          </div>
        </div>
      )}

      {status === "uploading" && (
        <div
          className="mt-3"
          role="status"
          aria-live="polite"
        >
          <div className="mb-1.5 flex justify-between text-xs text-muted">
            <span>
              {pct < 100 ? "Uploading" : "Verifying video"}
            </span>

            <span className="tabular-nums">
              {pct < 100 ? `${pct}%` : ""}
            </span>
          </div>

          <div
            className="h-1.5 overflow-hidden rounded-full bg-raised"
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={pct}
          >
            <div
              className={`h-full rounded-full bg-white transition-[width] ${
                pct >= 100 ? "animate-pulse" : ""
              }`}
              style={{ width: `${pct}%` }}
            />
          </div>

          <p className="mt-1.5 text-xs text-muted">
            {formatBytes(file.size * progress)} of{" "}
            {formatBytes(file.size)}
          </p>
        </div>
      )}

      <button
        type="button"
        onClick={u.upload}
        disabled={!showFile || status === "uploading"}
        className="mt-3 w-full rounded-xl bg-white py-3.5 text-[15px] font-semibold text-ink transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
      >
        {status === "uploading"
          ? "Uploading…"
          : status === "error" && canRetry
            ? "Try again"
            : "Upload video"}
      </button>
    </section>
  );
}
