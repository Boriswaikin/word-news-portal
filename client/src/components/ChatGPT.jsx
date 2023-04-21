import { useAuthToken } from "../AuthTokenContext";
import { useParams } from "react-router-dom";
import { useNews } from "../hooks/newsContext";
import useBookmarks from "../hooks/useBookmarks";
import { Configuration, OpenAIApi } from "openai";
import { useState } from "react";
import { useEffect } from "react";

export default function ChatGPT() {
    const { accessToken } = useAuthToken();
    // const { news } = useNews();
    const [news, setNews] = useBookmarks();
    const {newsID} = useParams();
    const index = parseInt(newsID);
    const thisNews = news[index];
    const [text,setText] = useState("");
    // const configuration = new Configuration({
    //   apiKey:process.env.REACT_APP_OPENAI_API_KEY,
    // });
  //  const openai = new OpenAIApi(configuration);

    async function getResponse(message){
      const prompt = 'Tell me more about '+`${message}`

      const requestOptions = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
           'Authorization': `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`,
           'User-Agent': 'MyApplication/1.0'
        },
        body: JSON.stringify({
          model:"gpt-3.5-turbo",
          messages: [{role: "user", content: `${prompt}`}], 
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
          setText(data.choices[0].message.content);
      }
      } catch (err) {
      console.log(err);
    }
    }
    return (
      <div>Tell me more about {thisNews?.title} by clicking this: 
      <button title="test" onClick={()=>getResponse(thisNews?.title)}>Ask ChatGPT</button>
      <p>Response: {text}</p>
      </div>
    )
  }