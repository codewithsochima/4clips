
import { useEffect, useMemo, useState } from "react";
import Timeline from "./Timeline";
import ClipResult from "./ClipResult";
import { useClipCreate } from "../hooks/useClipCreate";
import { formatBytes } from "../lib/format";
import {
  formatTime,
  maxDurationFor,
  validateClipInputs,
} from "../lib/time";

function Stat({ label, value }) {
  return (
    <div className="min-w-0">
      <dt className="text-xs text-muted">{label}</dt>
      <dd className="mt-0.5 truncate text-sm font-medium tabular-nums">
        {value}
      </dd>
    </div>
  );
}

function TimeField({
  id,
  label,
  value,
  onChange,
  error,
  hint,
  disabled,
}) {
  return (
    <div>
      <label
        htmlFor={id}
        className="mb-1.5 block text-sm font-medium"
      >
        {label}
      </label>

      <input
        id={id}
        type="text"
        inputMode="text"
        autoComplete="off"
        spellCheck="false"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        aria-invalid={Boolean(error)}
        aria-describedby={`${id}-note`}
        className={`w-full rounded-xl border bg-ink px-3.5 py-3 text-sm tabular-nums outline-none placeholder:text-muted/60 disabled:opacity-50 ${
          error
            ? "border-danger"
            : "border-line focus:border-white"
        }`}
      />

      <p
        id={`${id}-note`}
        className={`mt-1.5 min-h-5 text-xs ${
          error ? "text-danger" : "text-muted"
        }`}
      >
        {error || hint}
      </p>
    </div>
  );
}

export default function ClipWorkspace({
  upload,
  onUploadAnother,
}) {
  const { file, result } = upload;

  const videoDuration = Number(result.duration);

  const durationOk =
    Number.isFinite(videoDuration) && videoDuration > 0;

  const canCreateWholeSecondClip =
    durationOk && Math.floor(videoDuration) >= 1;

  const [startText, setStartText] = useState("0:00");

  const [lengthText, setLengthText] = useState(() =>
    String(
      Math.max(
        1,
        Math.min(30, Math.floor(videoDuration) || 1)
      )
    )
  );

  const clip = useClipCreate(result.filename);

  const [previewUrl, setPreviewUrl] = useState(null);
  const [previewFailed, setPreviewFailed] = useState(false);

  useEffect(() => {
    if (!file) return;

    const url = URL.createObjectURL(file);

    setPreviewUrl(url);
    setPreviewFailed(false);

    return () => {
      URL.revokeObjectURL(url);
    };
  }, [file]);

  const validation = useMemo(
    () =>
      durationOk
        ? validateClipInputs(
            startText,
            lengthText,
            videoDuration
          )
        : null,
    [startText, lengthText, videoDuration, durationOk]
  );

  const processing = clip.status === "processing";

  const name =
    result.originalName ||
    file?.name ||
    result.filename;

  const resolution =
    result.width && result.height
      ? `${result.width} × ${result.height}`
      : "—";

  const submit = (e) => {
    e.preventDefault();

    if (!validation?.valid || processing) return;

    clip.create({
      startTime: validation.start,
      duration: validation.duration,
    });
  };

  const maximumDuration =
    validation &&
    validation.start !== null &&
    validation.start < videoDuration
      ? maxDurationFor(validation.start, videoDuration)
      : 0;

  const maxHint =
    maximumDuration >= 1
      ? `Up to ${formatTime(maximumDuration)} from this start. Use seconds, MM:SS or HH:MM:SS.`
      : "Use seconds, MM:SS or HH:MM:SS.";

  return (
    <div className="flex w-full flex-col gap-4">
      <section
        aria-labelledby="source-title"
        className="rounded-2xl border border-line bg-panel p-4 sm:p-5"
      >
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h2
              id="source-title"
              className="truncate text-base font-semibold"
              title={name}
            >
              {name}
            </h2>

            <p className="text-sm text-muted">
              Your uploaded video
            </p>
          </div>

          <button
            type="button"
            onClick={onUploadAnother}
            disabled={processing}
            className="shrink-0 rounded-lg border border-line bg-raised px-3 py-2 text-sm font-medium hover:border-muted disabled:opacity-50"
          >
            Replace video
          </button>
        </div>

        {previewUrl && !previewFailed ? (
          <video
            src={previewUrl}
            controls
            preload="metadata"
            onError={() => setPreviewFailed(true)}
            className="mt-4 max-h-[50vh] w-full rounded-xl bg-black"
          />
        ) : (
          <p className="mt-4 rounded-xl bg-ink p-4 text-sm text-muted">
            Your browser can't preview this video format.
            You can still create a clip from it.
          </p>
        )}

        <dl className="mt-4 grid grid-cols-3 gap-3">
          <Stat
            label="Duration"
            value={
              durationOk
                ? formatTime(videoDuration)
                : "—"
            }
          />

          <Stat
            label="Resolution"
            value={resolution}
          />

          <Stat
            label="File size"
            value={formatBytes(result.size)}
          />
        </dl>
      </section>

      {clip.status === "success" ? (
        <ClipResult
          clip={clip.clip}
          onAnother={clip.reset}
          onUploadAnother={onUploadAnother}
        />
      ) : (
        <section
          aria-labelledby="clip-title"
          className="rounded-2xl border border-line bg-panel p-4 sm:p-5"
        >
          <h2
            id="clip-title"
            className="text-base font-semibold"
          >
            Create Your Clip
          </h2>

          <p className="mt-1 text-sm text-muted">
            Choose where the clip starts and how long it runs.
          </p>

          {!durationOk ? (
            <p
              role="alert"
              className="mt-4 rounded-xl border border-danger/30 bg-danger/10 p-3 text-sm text-white/80"
            >
              We couldn't read this video's length, so a clip
              can't be created. Try uploading it again.
            </p>
          ) : !canCreateWholeSecondClip ? (
            <p
              role="alert"
              className="mt-4 rounded-xl border border-danger/30 bg-danger/10 p-3 text-sm text-white/80"
            >
              This video is shorter than one second. Our
              current clipping tool requires at least one
              full second of video.
            </p>
          ) : (
            <form
              onSubmit={submit}
              noValidate
              className="mt-5"
            >
              <div className="grid gap-4 sm:grid-cols-2">
                <TimeField
                  id="clip-start"
                  label="Start time"
                  value={startText}
                  onChange={setStartText}
                  error={validation.errors.start}
                  hint="Use seconds, MM:SS or HH:MM:SS."
                  disabled={processing}
                />

                <TimeField
                  id="clip-length"
                  label="Clip duration"
                  value={lengthText}
                  onChange={setLengthText}
                  error={validation.errors.duration}
                  hint={maxHint}
                  disabled={processing}
                />
              </div>

              <div className="mt-2">
                <Timeline
                  videoDuration={videoDuration}
                  start={validation.start}
                  duration={validation.duration}
                  valid={validation.valid}
                />
              </div>

              {clip.status === "error" && (
                <div
                  role="alert"
                  className="mt-4 rounded-xl border border-danger/30 bg-danger/10 p-3 text-sm"
                >
                  <p className="font-medium text-danger">
                    Couldn't create the clip
                  </p>

                  <p className="mt-0.5 text-white/80">
                    {clip.error}
                  </p>
                </div>
              )}

              <p
                role="status"
                aria-live="polite"
                className="sr-only"
              >
                {processing ? "Creating your clip" : ""}
              </p>

              <button
                type="submit"
                disabled={!validation.valid || processing}
                className="mt-5 w-full rounded-xl bg-white py-3.5 text-[15px] font-semibold text-ink transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
              >
                {processing
                  ? "Creating clip…"
                  : clip.status === "error"
                    ? "Try again"
                    : "Generate clip"}
              </button>

              {processing && (
                <p className="mt-2 text-center text-xs text-muted">
                  Longer clips take more time. Keep this page open.
                </p>
              )}
            </form>
          )}
        </section>
      )}
    </div>
  );
}
