import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter, BrowserRouter } from "react-router-dom";
import ChatGPT from "../components/ChatGPT";

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
    return { accessToken: "" };
  },
}));

jest.mock("../hooks/markContext", () => ({
  useBookmark: () => {
    return {
      bookmarks: [
        {
          category: "business",
          displayTitle: "Bookmard Title",
          id: 1,
          publishDate: "2023-04-21",
          title: "Bookmard Actual Title",
        },
      ],
    };
  },
}));

test("Able to get placeholder - Ask ChatGPT about this news", () => {
  render(
    <MemoryRouter initialEntries={["/"]}>
      <ChatGPT />
    </MemoryRouter>
  );

  expect(
    screen.getByPlaceholderText("Ask ChatGPT about this news")
  ).toBeInTheDocument();
});

test("ChatGPT logo appears after clicking send button", () => {
  render(
    <BrowserRouter>
      <ChatGPT />
    </BrowserRouter>
  );

  const sendButton = screen.getByRole("button", { name: "send" });
  fireEvent.click(sendButton);
  expect(screen.getByAltText("GPT_Logo")).toBeInTheDocument();
});
