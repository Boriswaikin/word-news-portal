import "../style/chatGPT.css";
import { useAuthToken } from "../AuthTokenContext";
import { useParams } from "react-router-dom";
import { useBookmark } from "../hooks/markContext";
import { useState } from "react";
import { useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";

const GPTIcon = "https://raw.githubusercontent.com/SAP-Custom-Widget/ChatGptWidget/main/icon.png";

export default function ChatGPT() {
  const { user } = useAuth0();
  const { accessToken } = useAuthToken();
  const { bookmarks } = useBookmark();
  const {newsID} = useParams();
  const index = parseInt(newsID);
  const thisNews = bookmarks[index];
  

  const [input, setInput] = useState("");
  const [history, setHistory] = useState([]);

  function getResponse(){

    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`,
          // 'User-Agent': 'MyApplication/1.0'
      },
      body: JSON.stringify({
        model:"gpt-3.5-turbo",
        messages: [{role: "user", content: `${input}`}], 
        temperature: 0.1,
        stop: "\n",
      })
    };

    fetch('https://api.openai.com/v1/chat/completions', requestOptions)
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      setHistory((prev) => [...prev, data.choices[0].message.content]);})
    .catch( (err) => {
      console.log(err);
    })
  }

  async function saveResponse(){
    const historyAsString = history.join("\n");
    const response = await fetch(`${process.env.REACT_APP_API_URL}/chatGPT/` + thisNews.id, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        chatGPT: historyAsString,
      }),
    });
    if (!response.ok) {
      console.log("chatGPT dialog put error");
    }
  }

  useEffect(() => {
    if(!accessToken) return;

    fetch(`${process.env.REACT_APP_API_URL}/news/` + thisNews.id, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    }).then((response) => response.json())
      .then((data) => {
        if(data[0].chatGPT) {
          const historyAsArray = data[0].chatGPT.split("\n");
          setHistory(historyAsArray);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, [accessToken]);

  return (
    <div className="container">
      <h2>
        Ask me about the news "<span>{thisNews?.title}</span>... "
      </h2>

      <div className="chatbox-container">
        <ul className="GPT_wrapper">
          {history.map((item, index) => {
            return (
              <li key={index} className="GPT_response"> 
                  {index % 2 ? <img src={GPTIcon} className="GPTlogo" alt="GPT_Logo"></img> :
                                <img src={user.picture} className="Userlogo" alt="GPT_Logo"></img>   }
                  <p>{item}</p>
              </li>)
          })}
        </ul>
    
        <div className="input_wrapper">
          <textarea className="GPT_input"
            value={input}
            onChange={(event) => setInput(event.target.value)}
            rows={1}
            cols={100}
            placeholder="Ask ChatGPT about this news"
          />
          <button className="input_button" title="send" onClick={() => {
            setHistory((prev) => [...prev, input]);
            setInput("");
            getResponse()
          }}>
            <box-icon name='send' type="solid"></box-icon>
          </button> 
          <button className="input_button" title="save" onClick={saveResponse}>
            <box-icon name='save'></box-icon>
          </button>
        </div>
      </div>
    </div>
  );
  }