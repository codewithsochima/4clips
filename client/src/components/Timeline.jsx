
import { formatTime } from "../lib/time";

export default function Timeline({
  videoDuration,
  start,
  duration,
  valid,
}) {
  const durationIsValid =
    Number.isFinite(videoDuration) && videoDuration > 0;

  const hasStart =
    durationIsValid &&
    start !== null &&
    Number.isFinite(start) &&
    start >= 0 &&
    start < videoDuration;

  const hasDuration =
    duration !== null &&
    Number.isFinite(duration) &&
    duration > 0;

  const end =
    hasStart && hasDuration
      ? Math.min(start + duration, videoDuration)
      : null;

  const left = hasStart
    ? (start / videoDuration) * 100
    : 0;

  const width =
    end !== null
      ? Math.max(((end - start) / videoDuration) * 100, 0.8)
      : 0;

  const label =
    end !== null
      ? `Selected clip from ${formatTime(start)} to ${formatTime(end)} of ${formatTime(videoDuration)}`
      : `Video length ${formatTime(videoDuration)}`;

  return (
    <div>
      <div
        role="img"
        aria-label={label}
        className="relative h-10 overflow-hidden rounded-lg bg-raised"
      >
        {end !== null && (
          <div
            className={`absolute inset-y-0 rounded-md border-x-2 transition-all ${
              valid
                ? "border-white bg-white/25"
                : "border-danger bg-danger/20"
            }`}
            style={{
              left: `${left}%`,
              width: `${width}%`,
            }}
          />
        )}
      </div>

      <div className="mt-2 flex justify-between text-xs tabular-nums text-muted">
        <span>0:00</span>

        {end !== null && (
          <span className={valid ? "text-white" : "text-danger"}>
            {formatTime(start)} to {formatTime(end)}
          </span>
        )}

        <span>
          {durationIsValid ? formatTime(videoDuration) : "0:00"}
        </span>
      </div>
    </div>
  );
}
