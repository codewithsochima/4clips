
import Icon from "./Icon";

const items = [
  { icon: "spark", name: "Highlight detection" },
  { icon: "caption", name: "Auto captions" },
  { icon: "crop", name: "9:16 reframe" },
  { icon: "face", name: "Face tracking" },
];

export default function Roadmap() {
  return (
    <section aria-labelledby="roadmap" className="w-full">
      <h2
        id="roadmap"
        className="mb-5 text-center text-sm text-muted"
      >
        In development
      </h2>

      <ul className="grid grid-cols-2 gap-x-3 gap-y-6 sm:grid-cols-4">
        {items.map((i) => (
          <li
            key={i.name}
            className="flex flex-col items-center gap-2.5 text-center"
          >
            <span className="relative grid size-14 place-items-center rounded-full border border-line bg-panel text-muted">
              <Icon name={i.icon} className="size-6" />

              <span className="absolute -top-2 rounded-md bg-raised px-1.5 py-0.5 text-[11px] text-muted ring-1 ring-line">
                Soon
              </span>
            </span>

            <span className="text-sm text-muted">{i.name}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
