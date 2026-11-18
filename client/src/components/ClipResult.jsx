
import Icon from "./Icon";
import { formatTime } from "../lib/time";

export default function ClipResult({
  clip,
  onAnother,
  onUploadAnother,
}) {
  return (
    <section
      aria-labelledby="clip-done"
      className="rounded-2xl border border-line bg-panel p-4 sm:p-5"
    >
      <div className="flex items-center gap-3">
        <span className="grid size-9 place-items-center rounded-full bg-ok/15 text-ok">
          <Icon name="check" className="size-5" />
        </span>

        <div className="min-w-0">
          <h2 id="clip-done" className="text-base font-semibold">
            Clip created
          </h2>

          <p className="truncate text-sm text-muted">
            {formatTime(clip.duration)} long
          </p>
        </div>
      </div>

      <video
        key={clip.url}
        src={clip.url}
        controls
        preload="metadata"
        className="mt-4 max-h-[60vh] w-full rounded-xl bg-black"
      />

      <div className="mt-4 flex flex-col gap-2 sm:flex-row">
        <a
          href={clip.url}
          download={clip.filename || "4clips-clip.mp4"}
          className="flex-1 rounded-xl bg-white py-3 text-center text-sm font-semibold text-ink hover:opacity-90"
        >
          Download clip
        </a>

        <button
          type="button"
          onClick={onAnother}
          className="flex-1 rounded-xl border border-line bg-raised py-3 text-sm font-medium hover:border-muted"
        >
          Create another clip
        </button>

        <button
          type="button"
          onClick={onUploadAnother}
          className="flex-1 rounded-xl border border-line py-3 text-sm font-medium text-muted hover:text-white"
        >
          Upload another video
        </button>
      </div>
    </section>
  );
}
