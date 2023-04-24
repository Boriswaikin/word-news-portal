import { render, screen,fireEvent} from "@testing-library/react";
import { MemoryRouter ,BrowserRouter} from "react-router-dom";
import Bookmarks from "../components/Bookmarks";

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


jest.mock("../hooks/markContext", () => ({
    useBookmark: () => {
    return { bookmarks: [
      {category:"business",
       displayTitle:"Bookmard Title",
       id:1,
       publishDate:"2023-04-21",
       title:"Bookmard Actual Title"
    }] };
  },
}));

test("Able to get the screen text- title, Category, Publish Date ", () => {
  render(
    <MemoryRouter initialEntries={["/"]}>
      <Bookmarks />
    </MemoryRouter>
  );

  expect(screen.getByText("Title")).toBeInTheDocument();
  expect(screen.getByText("Category")).toBeInTheDocument();
  expect(screen.getByText("Publish Date")).toBeInTheDocument();
  });

  test("Click edit bookmark logo to pop out edit bookmark box", () => {
    render(
      <BrowserRouter>
        <Bookmarks />
      </BrowserRouter>
    );
  
    const editBookmarkrButton = screen.getByRole('button',{name:'edit bookmark'});
    fireEvent.click(editBookmarkrButton);
    expect(screen.getByText("Edit Bookmark")).toBeInTheDocument();
  });