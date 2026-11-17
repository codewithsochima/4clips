
import Icon from "./Icon";

const groups = [
  {
    label: "Create",
    items: [
      { name: "Home", icon: "home", active: true },
      { name: "Projects", icon: "folder", soon: true },
      { name: "Brand template", icon: "brand", soon: true },
    ],
  },
  {
    label: "Post",
    items: [
      { name: "Calendar", icon: "calendar", soon: true },
      { name: "Analytics", icon: "chart", soon: true },
      { name: "Social accounts", icon: "link", soon: true },
    ],
  },
];

export function Logo() {
  return (
    <div className="flex items-center gap-2.5">
      <span className="grid size-8 place-items-center rounded-lg bg-white text-sm font-bold text-ink">
        4
      </span>

      <span className="text-[17px] font-semibold tracking-tight">
        4Clips
      </span>
    </div>
  );
}

function NavItem({ item }) {
  const base =
    "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors";

  if (item.soon) {
    return (
      <button
        disabled
        className={`${base} cursor-not-allowed text-muted/70`}
      >
        <Icon name={item.icon} className="size-[18px]" />
        <span>{item.name}</span>

        <span className="ml-auto rounded-md bg-raised px-1.5 py-0.5 text-[11px] text-muted">
          Soon
        </span>
      </button>
    );
  }

  return (
    <a
      href="/"
      aria-current={item.active ? "page" : undefined}
      className={`${base} ${
        item.active
          ? "border border-line bg-raised font-medium text-white"
          : "text-muted hover:bg-raised hover:text-white"
      }`}
    >
      <Icon name={item.icon} className="size-[18px]" />
      {item.name}
    </a>
  );
}

export default function Sidebar() {
  return (
    <aside className="hidden w-64 shrink-0 flex-col border-r border-line bg-panel p-4 lg:flex">
      <div className="px-1 pb-5 pt-1">
        <Logo />
      </div>

      <nav aria-label="Main" className="flex flex-col gap-6">
        {groups.map((g) => (
          <div key={g.label}>
            <p className="mb-2 px-3 text-xs text-muted">
              {g.label}
            </p>

            <div className="flex flex-col gap-1">
              {g.items.map((i) => (
                <NavItem key={i.name} item={i} />
              ))}
            </div>
          </div>
        ))}
      </nav>

      <div className="mt-auto flex items-center gap-3 rounded-xl border border-line p-3">
        <span className="grid size-9 place-items-center rounded-full border border-line bg-raised text-sm font-semibold text-white">
          4
        </span>

        <div className="min-w-0 text-sm">
          <p className="truncate font-medium">My workspace</p>
          <p className="text-xs text-muted">Free plan</p>
        </div>
      </div>
    </aside>
  );
}
