import { render, screen } from "@testing-library/react";
import Home from "../components/Home";
import { MemoryRouter } from "react-router-dom";
import userEvent from "@testing-library/user-event";
import AppLayout from "../components/AppLayout";

let mockIsAuthenticated = false;
const mockLoginWithRedirect = jest.fn();
const mockUseNavigate = jest.fn();

jest.mock("@auth0/auth0-react", () => ({
  ...jest.requireActual("@auth0/auth0-react"),
  Auth0Provider: ({ children }) => children,
  useAuth0: () => {
    return {
      isLoading: false,
      user: { sub: "foobar" },
      isAuthenticated: mockIsAuthenticated,
      loginWithRedirect: mockLoginWithRedirect,
    };
  },
}));


test("renders AppLayout Home and Login Button", () => {
  render(
    <MemoryRouter initialEntries={["/"]}>
      <AppLayout />
    </MemoryRouter>
  );

  expect(screen.getByText("PressSphere")).toBeInTheDocument();
  expect(screen.getByText("LOG IN")).toBeInTheDocument();
});

test("login button calls loginWithRedirect", async () => {
  render(
    <MemoryRouter initialEntries={["/"]}>
      <AppLayout />
    </MemoryRouter>
  );

  const loginButton = screen.getByText("LOG IN");
  await userEvent.click(loginButton);

  expect(mockLoginWithRedirect).toHaveBeenCalled();
});

test("renders LOG IN button when user is authenticated", () => {
  mockIsAuthenticated = true;
  render(
    <MemoryRouter initialEntries={["/"]}>
      <AppLayout />
    </MemoryRouter>
  );

  expect(screen.getByText("LOG OUT")).toBeInTheDocument();
});
