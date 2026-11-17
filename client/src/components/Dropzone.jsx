
import { useRef, useState } from "react";
import Icon from "./Icon";
import { formatBytes } from "../lib/format";

export default function Dropzone({ file, onSelect, onClear, disabled }) {
  const input = useRef(null);
  const [over, setOver] = useState(false);

  const onDrop = (e) => {
    e.preventDefault();
    setOver(false);

    if (!disabled) {
      onSelect(e.dataTransfer.files?.[0]);
    }
  };

  if (file) {
    return (
      <div className="flex items-center gap-4 rounded-xl border border-line bg-ink p-4">
        <span className="grid size-11 shrink-0 place-items-center rounded-lg bg-raised text-muted">
          <Icon name="video" />
        </span>

        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium" title={file.name}>
            {file.name}
          </p>

          <p className="text-xs text-muted">
            {formatBytes(file.size)}
          </p>
        </div>

        {!disabled && (
          <button
            type="button"
            onClick={onClear}
            aria-label="Remove selected video"
            className="grid size-9 place-items-center rounded-lg text-muted hover:bg-raised hover:text-white"
          >
            <Icon name="x" className="size-4" />
          </button>
        )}
      </div>
    );
  }

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        if (!disabled) setOver(true);
      }}
      onDragLeave={() => setOver(false)}
      onDrop={onDrop}
      className={`rounded-xl border border-dashed px-6 py-10 text-center transition-colors sm:py-14 ${
        over
          ? "border-white bg-raised"
          : "border-line bg-ink"
      }`}
    >
      <span className="mx-auto mb-4 grid size-11 place-items-center rounded-full bg-raised text-muted">
        <Icon name="upload" />
      </span>

      <p className="text-sm font-medium">
        Drag a video here
      </p>

      <p className="mt-1 text-sm text-muted">or</p>

      <input
        ref={input}
        id="video-input"
        type="file"
        accept=".mp4,.mov,.mkv,.webm,.avi,video/*"
        className="sr-only"
        disabled={disabled}
        onChange={(e) => {
          onSelect(e.target.files?.[0]);
          e.target.value = "";
        }}
      />

      <button
        type="button"
        disabled={disabled}
        onClick={() => input.current?.click()}
        className="mt-3 rounded-lg border border-line bg-raised px-4 py-2 text-sm font-medium hover:border-muted disabled:cursor-not-allowed disabled:opacity-50"
      >
        Browse files
      </button>

      <p className="mt-5 text-xs text-muted">
        MP4, MOV, MKV, WEBM or AVI. Up to 500 MB.
      </p>
    </div>
  );
}
