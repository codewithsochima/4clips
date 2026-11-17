
export const MAX_BYTES = 500 * 1024 * 1024;

export const ALLOWED_EXT = ["mp4", "mov", "mkv", "webm", "avi"];

export function formatBytes(bytes) {
  if (!Number.isFinite(bytes) || bytes < 0) return "—";

  const units = ["B", "KB", "MB", "GB"];
  let i = 0;
  let n = bytes;

  while (n >= 1024 && i < units.length - 1) {
    n /= 1024;
    i++;
  }

  return `${n.toFixed(n >= 100 || i === 0 ? 0 : 1)} ${units[i]}`;
}

export function formatDuration(sec) {
  const s = Math.round(Number(sec));

  if (!Number.isFinite(s) || s < 0) return "—";

  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const r = s % 60;

  const pad = (v) => String(v).padStart(2, "0");

  return h ? `${h}:${pad(m)}:${pad(r)}` : `${m}:${pad(r)}`;
}

export function validateVideo(file) {
  if (!file || typeof file.name !== "string") {
    return "Please select a valid video file.";
  }

  const ext = file.name.split(".").pop()?.toLowerCase();

  if (!ALLOWED_EXT.includes(ext)) {
    return `.${ext || "?"} files aren't supported. Use MP4, MOV, MKV, WEBM or AVI.`;
  }

  if (!Number.isFinite(file.size) || file.size <= 0) {
    return "This file is empty or invalid.";
  }

  if (file.size > MAX_BYTES) {
    return `This file is ${formatBytes(file.size)}. The limit is 500 MB.`;
  }

  return null;
}
