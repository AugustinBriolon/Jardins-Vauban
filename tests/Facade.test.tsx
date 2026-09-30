import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Facade from "@/components/lots/Facade";
import { makeLot } from "./fixtures";

const lots = [
  makeLot({ id: "1", reference: "A001", etage: 0 }),
  makeLot({ id: "2", reference: "A002", etage: 0, statut: "Vendu" }),
  makeLot({ id: "3", reference: "A101", etage: 1, type: "T3", surface: 68, prix: 312_000 }),
];

describe("Facade", () => {
  it("renders one labelled window per lot, grouped by floor", () => {
    render(<Facade lots={lots} />);
    expect(screen.getAllByRole("button")).toHaveLength(3);
    expect(screen.getByRole("group", { name: "Rez-de-jardin" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Lot A101, T3, 68 m², 1er étage/ })).toBeInTheDocument();
  });

  it("calls onSelect with the clicked lot", async () => {
    const onSelect = vi.fn();
    render(<Facade lots={lots} onSelect={onSelect} />);
    await userEvent.click(screen.getByRole("button", { name: /Lot A002/ }));
    expect(onSelect).toHaveBeenCalledWith(lots[1]);
  });

  it("shows the hovered lot in the readout", async () => {
    render(<Facade lots={lots} />);
    expect(screen.getByText(/2 logements disponibles/)).toBeInTheDocument();
    await userEvent.hover(screen.getByRole("button", { name: /Lot A101/ }));
    expect(await screen.findByText(/312\s000\s€/)).toBeInTheDocument();
  });

  it("marks the selected window as pressed", () => {
    render(<Facade lots={lots} selectedId="3" onSelect={() => {}} />);
    expect(screen.getByRole("button", { name: /Lot A101/ })).toHaveAttribute("aria-pressed", "true");
  });
});
