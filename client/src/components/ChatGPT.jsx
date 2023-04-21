import { useAuthToken } from "../AuthTokenContext";
import { useParams } from "react-router-dom";
import { useNews } from "../hooks/newsContext";

export default function ChatGPT() {
    const { accessToken } = useAuthToken();
    const { news } = useNews();
    const { newsID } = useParams();
    const index = parseInt(newsID);
    const thisNews = news[index];

    

    return (
      <div>Tell me more about {thisNews?.title}</div>
    )
  }