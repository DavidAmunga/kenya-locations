import { createFileRoute } from "@tanstack/react-router";
import { DATA_VERSION } from "kenya-locations";
import { Docs } from "@/components/docs";
import { DATASET, Explorer } from "@/components/explorer";
import { Separator } from "@/components/ui/separator";

export const Route = createFileRoute("/")({
  component: HomePage,
});

function HomePage() {
  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-4 pt-8 pb-12 sm:px-6 sm:pt-10">
      <section className="max-w-2xl" id="top">
        <p className="text-muted-foreground text-sm">
          v{DATA_VERSION} · IEBC + KNBS
        </p>
        <h1 className="mt-2 font-heading text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
          Kenyan administrative divisions, as a library
        </h1>
        <p className="mt-3 text-muted-foreground text-sm">
          {DATASET.counties} counties · {DATASET.subCounties.toLocaleString()}{" "}
          sub-counties · {DATASET.constituencies} constituencies ·{" "}
          {DATASET.wards.toLocaleString()} wards · {DATASET.localities}{" "}
          localities · {DATASET.areas.toLocaleString()} areas
        </p>
      </section>

      <Explorer />
      <Separator />
      <Docs />

      <footer className="border-t pt-8 pb-4 text-muted-foreground text-sm">
        <p>
          MIT ·{" "}
          <a
            className="text-foreground underline-offset-4 hover:underline"
            href="https://davidamunga.com"
            rel="noreferrer"
            target="_blank"
          >
            David Amunga
          </a>
          {" · "}data v{DATA_VERSION}
        </p>
      </footer>
    </div>
  );
}
