import { render, screen,fireEvent} from "@testing-library/react";
import { MemoryRouter ,BrowserRouter} from "react-router-dom";
import NewsDetail from "../components/NewsDetail";

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


test("Test the image of news exists in details page", () => {
  render(
    <MemoryRouter initialEntries={["/"]}>
      <NewsDetail />
    </MemoryRouter>
  );

  expect(screen.getByAltText("News_Image")).toBeInTheDocument();
  });

  test("Able to get text - Read More", () => {
    render(
        <MemoryRouter initialEntries={["/"]}>
          <NewsDetail />
        </MemoryRouter>
    );
  
    expect(screen.getByText("[Read More]")).toBeInTheDocument();
  })