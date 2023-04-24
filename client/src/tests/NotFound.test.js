import { render, screen } from "@testing-library/react";
import NotFound from "../components/NotFound";

test("renders Not Found copy", async() => {
  render(<NotFound />);
  expect(screen.getByText("NotFound")).toBeInTheDocument();
});
