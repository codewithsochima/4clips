import { useState } from "react";
import Sidebar, { Logo } from "./components/Sidebar";
import UploadCard from "./components/UploadCard";
import Roadmap from "./components/Roadmap";
import ClipWorkspace from "./components/ClipWorkspace";
import { useVideoUpload } from "./hooks/useVideoUpload";

export default function App() {
  const upload = useVideoUpload();

  const [view, setView] = useState("upload");

  const inWorkspace =
    view === "workspace" && upload.status === "success";

  const startOver = () => {
    upload.reset();
    setView("upload");
  };

  return (
    <div className="flex min-h-full">
      <Sidebar />

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center justify-between border-b border-line px-4 py-3 lg:hidden">
          <Logo />

          <span className="grid size-8 place-items-center rounded-full border border-line bg-raised text-sm font-semibold text-white">
            4
          </span>
        </header>

        {inWorkspace ? (
          <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-8 sm:py-12">
            <ClipWorkspace
              key={upload.result?.filename}
              upload={upload}
              onUploadAnother={startOver}
            />
          </main>
        ) : (
          <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col items-center gap-12 px-4 py-10 sm:py-16 lg:justify-center">
            <div className="text-center">
              <h1 className="text-balance text-3xl font-semibold tracking-tight sm:text-5xl">
                Turn long videos into short clips
              </h1>

              <p className="mx-auto mt-4 max-w-md text-pretty text-base text-muted">
                Upload a video to get started. We check it and read its details, so it's ready for clipping as features roll out.
              </p>
            </div>

            <UploadCard
              u={upload}
              onContinue={() => setView("workspace")}
            />

            <Roadmap />
          </main>
        )}
      </div>
    </div>
  );
}
