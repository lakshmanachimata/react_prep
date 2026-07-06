import { render, screen } from "@testing-library/react";
import RenderDebugBadge from "@/components/RenderDebugBadge";

describe("RenderDebugBadge", () => {
  it("renders name and count", () => {
    render(<RenderDebugBadge name="MyComponent" count={3} />);
    expect(screen.getByText("MyComponent render #3")).toBeInTheDocument();
  });
});
