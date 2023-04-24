import { render, screen,fireEvent} from "@testing-library/react";
import Home from "../components/Home";
import { MemoryRouter ,BrowserRouter} from "react-router-dom";
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
    return { news: [
      {
        author:'news author',
        content:"testing news",
        description:"testing news description",
        publishAt:"2023-04-21",
        source:{id:"testing id",name:"testing source"},
        title:"testing title",
        url:"testing url",
        urlToImage:"testing image"
      }

    ] };
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

  test("Able to navigate to details page after clicking news item link", () => {
    render(
      <BrowserRouter>
        <Home />
      </BrowserRouter>
    );
  
    const newsDetailsButton = screen.getByRole('link',{name:'To news detail'});
    fireEvent.click(newsDetailsButton);
    expect(window.location.href).toBe('http://localhost/details/0');
  });