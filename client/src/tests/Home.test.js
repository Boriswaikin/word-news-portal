import { render, screen } from "@testing-library/react";
import Home from "../components/Home";
import { MemoryRouter } from "react-router-dom";
import userEvent from "@testing-library/user-event";

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

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => {
    return mockUseNavigate;
  },
}));

jest.mock("../AuthTokenContext", () => ({
  useAuthToken: () => {
    return { accessToken: "123" };
  },
}));

jest.mock("../hooks/newsContext", () => ({
  useNews: () => {
    return { news: [] };
  },
}));

jest.mock("../hooks/markContext", () => ({
    useBookmark: () => {
    return { bookmarks: [] };
  },
}));

test("renders Home screen to check button and text exists", () => {
  render(
    <MemoryRouter initialEntries={["/"]}>
      <Home />
    </MemoryRouter>
  );

  expect(screen.getByText("Date Range")).toBeInTheDocument();
  expect(screen.getByText("Search")).toBeInTheDocument();
  expect(screen.getByText("Business")).toBeInTheDocument();
  expect(screen.getByText("Entertainment")).toBeInTheDocument();
  expect(screen.getByText("Health")).toBeInTheDocument();
  expect(screen.getByText("Science")).toBeInTheDocument();
  expect(screen.getByText("Sports")).toBeInTheDocument();
  expect(screen.getByText("Technology")).toBeInTheDocument();
  expect(screen.getByText("LATEST")).toBeInTheDocument();
  expect(screen.getByText("HOT NEWS")).toBeInTheDocument();
  });
