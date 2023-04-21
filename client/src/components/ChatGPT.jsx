import { useAuthToken } from "../AuthTokenContext";
import { useParams } from "react-router-dom";
import { useNews } from "../hooks/newsContext";
import { useBookmark } from "../hooks/markContext";
import { Configuration, OpenAIApi } from "openai";
import { useState } from "react";
import { useEffect } from "react";

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
    // return (
    //   <div>Tell me more about "{thisNews?.title}" by clicking this: 
    //   <button title="test" onClick={()=>getResponse(thisNews?.title)}>Ask ChatGPT</button>
    //   <p>Response: {text}</p>
    //   </div>
    // )
    return (
      <div className="container">
        <h2>Tell me something, and I'll tell you more</h2>
        <textarea
          value={input}
          onChange={(event) => setInput(event.target.value)}
          rows={5}
          placeholder="Type in some words and I'll finish the rest..."
        />
        <button className="button" onClick={getResponse}>Complete Sentence</button>
        {text && <p>Completed sentence: {text}</p>}
      </div>
    );
  }