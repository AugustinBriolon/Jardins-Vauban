import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import Neighbourhood from "@/components/home/Neighbourhood";

// Pretend the section is on screen so the map would be mounted.
vi.mock("motion/react", async (importOriginal) => ({
  ...(await importOriginal<typeof import("motion/react")>()),
  useInView: () => true,
}));

describe("Neighbourhood", () => {
  it("lists nearby places with travel times", () => {
    render(<Neighbourhood />);
    expect(screen.getByText("Tram B — Bergonié")).toBeInTheDocument();
    expect(screen.getByText("Gare Saint-Jean")).toBeInTheDocument();
  });

  it("shows a readable fallback instead of crashing when WebGL2 is unavailable", () => {
    vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockReturnValue(null);
    render(<Neighbourhood />);
    expect(screen.getByText(/ne peut pas s'afficher sur cet appareil/)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /OpenStreetMap/ })).toHaveAttribute("href", expect.stringContaining("openstreetmap.org"));
  });
});
