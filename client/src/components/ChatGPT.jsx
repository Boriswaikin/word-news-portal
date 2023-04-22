import "../style/chatGPT.css";
import { useAuthToken } from "../AuthTokenContext";
import { useParams } from "react-router-dom";
import { useNews } from "../hooks/newsContext";
import { useBookmark } from "../hooks/markContext";
import { Configuration, OpenAIApi } from "openai";
import { useState } from "react";
import { useEffect } from "react";

const GPTIcon = "https://raw.githubusercontent.com/SAP-Custom-Widget/ChatGptWidget/main/icon.png";

export default function ChatGPT() {
    // TODO: enter from home page for now
    const { news } = useNews();
    // const { bookmarks, setBookmarks } = useBookmark();
    const {newsID} = useParams();
    const index = parseInt(newsID);
    const thisNews = news[index];

    const [input, setInput] = useState("");
    const [text,setText] = useState("");

    // const configuration = new Configuration({
    //   apiKey:process.env.REACT_APP_OPENAI_API_KEY,
    // });
  //  const openai = new OpenAIApi(configuration);

    async function getResponse(){
      
      const prompt = `What do you know about"`

      const requestOptions = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
           'Authorization': `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`,
           'User-Agent': 'MyApplication/1.0'
        },
        body: JSON.stringify({
          model:"gpt-3.5-turbo",
          messages: [{role: "user", content: `${input}`}], 
          // prompt: prompt,
          temperature: 0.1,
          stop: "\n",
        })
      };

    try {
      // ChatGPT 3.5 version
      // const response = await openai.createChatCompletion({
      //     model:"gpt-3.5-turbo",
      //     messages: [{role: "user", content: `${prompt}`}], 
      //     //least variance of the response
      //     temperature:0,
      //     //Got the first paragraph only to reduce fetch time
      //     stop: "\n",
      // })
      const response = await fetch('https://api.openai.com/v1/chat/completions', requestOptions);
      if(response.ok){
          const data = await response.json();
          console.log(data);
          setText(data.choices[0].message.content);
      }
      } catch (err) {
        console.log(err);
      }
    }

    function saveResponse(){}
    // return (
    //   <div>Tell me more about "{thisNews?.title}" by clicking this: 
    //   <button title="test" onClick={()=>getResponse(thisNews?.title)}>Ask ChatGPT</button>
    //   <p>Response: {text}</p>
    //   </div>
    // )
    return (
      <div className="container">
        <h2>{thisNews?.title}</h2>
        <div className="input_wrapper">
          <textarea className="GPT_input"
            value={input}
            onChange={(event) => setInput(event.target.value)}
            rows={2.5}
            cols={100}
            placeholder="Ask ChatGPT about this news"
          />
          <button className="askGPT" onClick={getResponse}>
            <box-icon name='send' type="solid"></box-icon>
          </button>
        </div>
        {text &&
          <div className="GPT_wrapper">
            <div className="GPT_response"> 
              <img src={GPTIcon} className="GPTlogo" alt="GPT_Logo"></img>
              <p>{text}</p>
            </div>
            <button className="save" onClick={saveResponse}>
              Save
            </button>
          </div>
        }
      </div>
    );
  }