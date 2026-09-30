import { afterEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ContactForm from "@/components/contact/ContactForm";

const router = { query: {} as Record<string, string> };
vi.mock("next/router", () => ({ useRouter: () => router }));

async function fillValidForm() {
  const user = userEvent.setup();
  await user.type(screen.getByLabelText(/Prénom/), "Camille");
  await user.type(screen.getByLabelText(/^Nom/), "Durand");
  await user.type(screen.getByLabelText(/E-mail/), "camille@example.fr");
  await user.type(screen.getByLabelText(/Votre projet/), "Un T3 exposé sud, merci.");
  await user.click(screen.getByRole("checkbox"));
  return user;
}

afterEach(() => {
  router.query = {};
  vi.unstubAllGlobals();
});

describe("ContactForm", () => {
  it("shows inline errors instead of sending an incomplete form", async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);
    render(<ContactForm />);

    await userEvent.click(screen.getByRole("button", { name: /Envoyer ma demande/ }));

    expect(await screen.findByText("Indiquez votre prénom.")).toBeInTheDocument();
    expect(screen.getByLabelText(/E-mail/)).toHaveAttribute("aria-invalid", "true");
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("pre-fills the lot from the ?lot= query parameter", () => {
    router.query = { lot: "A012" };
    render(<ContactForm />);
    expect(screen.getByLabelText(/Lot qui vous intéresse/)).toHaveValue("A012");
  });

  it("ignores a malformed lot parameter", () => {
    router.query = { lot: "<script>" };
    render(<ContactForm />);
    expect(screen.getByLabelText(/Lot qui vous intéresse/)).toHaveValue("");
  });

  it("posts the enquiry as JSON and thanks the visitor by name", async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response(JSON.stringify({ success: true }), { status: 201 }));
    vi.stubGlobal("fetch", fetchMock);
    render(<ContactForm />);

    const user = await fillValidForm();
    await user.click(screen.getByRole("button", { name: /Envoyer ma demande/ }));

    expect(await screen.findByText("Merci, Camille.")).toBeInTheDocument();
    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe("/api/contact");
    expect(JSON.parse(init.body)).toMatchObject({ prenom: "Camille", email: "camille@example.fr", consentement: true });
  });

  it("surfaces the server error and keeps the form", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(new Response(JSON.stringify({ error: "Trop de requêtes." }), { status: 429 }))
    );
    render(<ContactForm />);

    const user = await fillValidForm();
    await user.click(screen.getByRole("button", { name: /Envoyer ma demande/ }));

    expect(await screen.findByRole("alert")).toHaveTextContent("Trop de requêtes.");
    expect(screen.getByLabelText(/Prénom/)).toHaveValue("Camille");
  });
});
