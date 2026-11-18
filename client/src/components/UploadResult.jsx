import Icon from "./Icon";
import { formatBytes, formatDuration } from "../lib/format";

function Field({ label, value }) {
  return (
    <div className="rounded-xl bg-ink p-3">
      <dt className="text-xs text-muted">{label}</dt>

      <dd
        className="mt-1 truncate text-sm font-medium tabular-nums"
        title={String(value)}
      >
        {value}
      </dd>
    </div>
  );
}

export default function UploadResult({
  result,
  file,
  onReset,
  onContinue,
}) {
  const name =
    result.originalName ||
    file?.name ||
    result.filename;

  const resolution =
    result.width && result.height
      ? `${result.width} × ${result.height}`
      : "—";

  return (
    <section
      aria-labelledby="done-title"
      className="w-full rounded-2xl border border-line bg-panel p-4 sm:p-5"
    >
      <div className="flex items-center gap-3">
        <span className="grid size-9 place-items-center rounded-full bg-ok/15 text-ok">
          <Icon name="check" className="size-5" />
        </span>

        <div className="min-w-0">
          <h2
            id="done-title"
            className="text-base font-semibold"
          >
            Upload complete
          </h2>

          <p className="text-sm text-muted">
            Your video was uploaded and verified.
          </p>
        </div>
      </div>

      <dl className="mt-4 grid grid-cols-2 gap-2">
        <div className="col-span-2">
          <Field label="Video name" value={name} />
        </div>

        <Field
          label="Duration"
          value={formatDuration(result.duration)}
        />

        <Field
          label="Resolution"
          value={resolution}
        />

        <Field
          label="File size"
          value={formatBytes(result.size)}
        />

        <Field
          label="Status"
          value="Uploaded and verified"
        />
      </dl>

      <div className="mt-4 flex flex-col gap-2 sm:flex-row">
        <button
          type="button"
          onClick={onContinue}
          className="flex-1 rounded-xl bg-white py-3 text-sm font-semibold text-ink hover:opacity-90"
        >
          Create a clip
        </button>

        <button
          type="button"
          onClick={onReset}
          className="flex-1 rounded-xl border border-line bg-raised py-3 text-sm font-medium hover:border-muted"
        >
          Upload another video
        </button>
      </div>
    </section>
  );
}
