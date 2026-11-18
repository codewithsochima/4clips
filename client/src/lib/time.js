
/**
 * Convert user-entered time into whole seconds.
 *
 * Accepted formats:
 * 90       = 90 seconds
 * 1:30     = 1 minute, 30 seconds
 * 0:03:00  = 3 minutes
 */
export function parseTime(text) {
  const value = String(text ?? "").trim();

  if (!value) {
    return { error: "Enter a time." };
  }

  const parts = value.split(":");

  if (
    parts.length > 3 ||
    parts.some((part) => !/^\d+$/.test(part.trim()))
  ) {
    return {
      error: "Use seconds, MM:SS or HH:MM:SS, for example 90, 1:30 or 0:03:00.",
    };
  }

  const numbers = parts.map((part) => Number(part.trim()));

  if (numbers.slice(1).some((number) => number > 59)) {
    return {
      error: "Minutes and seconds after the first value must be 59 or less.",
    };
  }

  const seconds = numbers.reduce(
    (total, number) => total * 60 + number,
    0
  );

  if (!Number.isSafeInteger(seconds)) {
    return { error: "That time is too large." };
  }

  return { seconds };
}

/**
 * Convert seconds into M:SS or H:MM:SS.
 */
export function formatTime(totalSeconds) {
  const value = Number(totalSeconds);

  if (!Number.isFinite(value)) {
    return "0:00";
  }

  const seconds = Math.max(0, Math.round(value));

  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;

  const pad = (number) => String(number).padStart(2, "0");

  return hours
    ? `${hours}:${pad(minutes)}:${pad(remainingSeconds)}`
    : `${minutes}:${pad(remainingSeconds)}`;
}

/**
 * Calculate the longest whole-second clip that fits
 * from a selected starting point.
 */
export function maxDurationFor(start, videoDuration) {
  if (
    !Number.isFinite(start) ||
    !Number.isFinite(videoDuration) ||
    start < 0 ||
    videoDuration <= start
  ) {
    return 0;
  }

  return Math.max(0, Math.floor(videoDuration - start));
}

/**
 * Validate the start time and clip duration.
 *
 * Returns:
 * {
 *   valid,
 *   start,
 *   duration,
 *   errors
 * }
 */
export function validateClipInputs(
  startText,
  durationText,
  videoDuration
) {
  const errors = {};

  const startResult = parseTime(startText);
  const durationResult = parseTime(durationText);

  const start = startResult.error ? null : startResult.seconds;
  const duration = durationResult.error
    ? null
    : durationResult.seconds;

  if (
    !Number.isFinite(videoDuration) ||
    videoDuration <= 0
  ) {
    errors.video = "The video duration is invalid.";
  }

  if (startResult.error) {
    errors.start = startResult.error;
  }

  if (durationResult.error) {
    errors.duration = durationResult.error;
  }

  if (
    start !== null &&
    Number.isFinite(videoDuration) &&
    videoDuration > 0 &&
    start >= videoDuration
  ) {
    errors.start = `The video is ${formatTime(videoDuration)} long. Start before that.`;
  }

  if (
    duration !== null &&
    !errors.duration &&
    duration < 1
  ) {
    errors.duration = "The clip must be at least 1 second long.";
  }

  if (
    start !== null &&
    duration !== null &&
    !errors.start &&
    !errors.duration &&
    !errors.video
  ) {
    const maximum = maxDurationFor(start, videoDuration);

    if (duration > maximum) {
      errors.duration =
        maximum >= 1
          ? `From ${formatTime(start)}, the longest clip is ${formatTime(maximum)}.`
          : `There's no full second of video left after ${formatTime(start)}. Choose an earlier start.`;
    }
  }

  return {
    valid: Object.keys(errors).length === 0,
    start,
    duration,
    errors,
  };
}
