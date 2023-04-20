import { useNews } from "../hooks/useNews";
import { useAuthToken } from "../AuthTokenContext";
import { useParams } from "react-router-dom";

export default function ChatGPT() {
    const { accessToken } = useAuthToken();
    const [news] = useNews()[0];
    const {newsID} = useParams();
    const index = parseInt(newsID);
    const thisNews = news[index];

    

    return (
      <div>Tell me more about {thisNews?.title}</div>
    )
  }