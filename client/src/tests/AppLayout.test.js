import { render, screen,fireEvent} from "@testing-library/react";
import { MemoryRouter ,BrowserRouter} from "react-router-dom";
import userEvent from "@testing-library/user-event";
import AppLayout from "../components/AppLayout";
import {createMemoryHistory} from 'history'


let mockIsAuthenticated = false;
const mockLoginWithRedirect = jest.fn();
const mockUseNavigate = jest.fn();
const history = createMemoryHistory();
history.push = jest.fn();

jest.mock("@auth0/auth0-react", () => ({
  ...jest.requireActual("@auth0/auth0-react"),
  Auth0Provider: ({ children }) => children,
  useAuth0: () => {
    return {
      isLoading: false,
      // user: { sub: "foobar" },
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


test("Click bookmarks logo to navigate to /app/bookmarks", () => {
  mockIsAuthenticated = true;
  render(
    <BrowserRouter>
      <AppLayout />
    </BrowserRouter>
  );

  const bookmarksButton = screen.getByRole('link',{name:'Bookmarks page'});
  fireEvent.click(bookmarksButton);
  expect(window.location.href).toBe('http://localhost/app/bookmarks');
});

test("Click profile logo to navigate to /app/Profile", () => {
  mockIsAuthenticated = true;
  render(
    <BrowserRouter>
      <AppLayout />
    </BrowserRouter>
  );

  const profileButton = screen.getByRole('link',{name:'Profile page'});
  fireEvent.click(profileButton);
  expect(window.location.href).toBe('http://localhost/app/Profile');
});