import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import LotSearch from "@/components/home/LotSearch";
import { makeLot } from "./fixtures";

const lots = [
  makeLot({ id: "1", type: "T2", prix: 190_000 }),
  makeLot({ id: "2", type: "T3", prix: 290_000 }),
  makeLot({ id: "3", type: "T3", prix: 310_000, statut: "Vendu" }),
  makeLot({ id: "4", type: "T4", prix: 420_000 }),
];

describe("LotSearch", () => {
  it("counts only available lots by default", () => {
    render(<LotSearch lots={lots} onSearch={() => {}} />);
    expect(screen.getByRole("button", { name: /Voir les 3 logements/ })).toBeEnabled();
  });

  it("sends the selected type and budget, available lots only", async () => {
    const onSearch = vi.fn();
    const user = userEvent.setup();
    render(<LotSearch lots={lots} onSearch={onSearch} />);

    await user.click(screen.getByRole("button", { name: "T3" }));
    await user.selectOptions(screen.getByLabelText("Budget maximum"), "300000");
    await user.click(screen.getByRole("button", { name: /Voir les/ }));

    expect(onSearch).toHaveBeenCalledWith({ types: ["T3"], budgetMax: 300_000, availableOnly: true });
  });

  it("disables the search when nothing matches", async () => {
    const user = userEvent.setup();
    render(<LotSearch lots={lots} onSearch={() => {}} />);
    await user.click(screen.getByRole("button", { name: "T4" }));
    await user.selectOptions(screen.getByLabelText("Budget maximum"), "200000");
    expect(screen.getByRole("button", { name: /Aucun logement/ })).toBeDisabled();
  });
});
