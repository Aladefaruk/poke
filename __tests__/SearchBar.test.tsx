import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { SearchBar } from "@/components/SearchBar";

describe("SearchBar", () => {
  it("renders with default placeholder", () => {
    render(<SearchBar value="" onChange={vi.fn()} />);
    expect(screen.getByPlaceholderText("Search Pokémon…")).toBeInTheDocument();
  });

  it("renders with custom placeholder", () => {
    render(<SearchBar value="" onChange={vi.fn()} placeholder="Find a film…" />);
    expect(screen.getByPlaceholderText("Find a film…")).toBeInTheDocument();
  });

  it("displays the current value", () => {
    render(<SearchBar value="Inception" onChange={vi.fn()} />);
    expect(screen.getByRole("searchbox")).toHaveValue("Inception");
  });

  it("calls onChange when user types", () => {
    const onChange = vi.fn();
    render(<SearchBar value="" onChange={onChange} />);
    fireEvent.change(screen.getByRole("searchbox"), { target: { value: "Batman" } });
    expect(onChange).toHaveBeenCalledWith("Batman");
  });

  it("shows clear button only when value is non-empty", () => {
    const { rerender } = render(<SearchBar value="" onChange={vi.fn()} />);
    expect(screen.queryByLabelText("Clear search")).not.toBeInTheDocument();

    rerender(<SearchBar value="test" onChange={vi.fn()} />);
    expect(screen.getByLabelText("Clear search")).toBeInTheDocument();
  });

  it("calls onChange with empty string when clear button is clicked", () => {
    const onChange = vi.fn();
    render(<SearchBar value="Batman" onChange={onChange} />);
    fireEvent.click(screen.getByLabelText("Clear search"));
    expect(onChange).toHaveBeenCalledWith("");
  });

  it("has accessible label for screen readers", () => {
    render(<SearchBar value="" onChange={vi.fn()} />);
    // sr-only label should be present
    expect(screen.getByLabelText("Search Pokémon")).toBeInTheDocument();
  });

  it("has correct input type for mobile keyboard optimization", () => {
    render(<SearchBar value="" onChange={vi.fn()} />);
    expect(screen.getByRole("searchbox")).toHaveAttribute("type", "search");
  });
});
