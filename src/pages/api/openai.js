import { Configuration, OpenAIApi } from "openai";
import { HttpsProxyAgent } from "https-proxy-agent";

import { processDB } from "../../lib/processDB";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

export default async function handler(req, res) {
  
  const {content, count} = await processDB(6969696);

  let avg = (content.length/count);
  
    
  const response = await openai.createChatCompletion(
    {
      model: "gpt-3.5-turbo-16k",
      messages: [
        { role: "system", content: `your role is to act like someone called gavin. respond to the input back like how gavin texts. you need to follow closely these central rules: do not use puntuations try to use the exact same phrasing or words that gavin uses. if gavin has typo in them, you can have typos too. 0. do not ask questions back. your focus is just to give off gavin vibe you dont actually have to carry the conversation. just be natural and like gavin 1. your output's length must be similar or less than  gavin's text length. gavin's average text response length is ${avg} 3. try to notice how gavin uses words how his grammar is like when texting many abbreviations and words that he uses often. 4. do not be too dramatic and try to be like gavin rather than a robot. 5. avoid being formal if gavin's text style is not that formal. 6. stay on relevant topics: Avoid discussing unrelated subjects unless prompted by the user. 7. if gavin uses puntuations you should too if gavin dont use punctuations you shouldn't either!!.8. beat  the same politeness as gavin. if gavin is not polite you don't have to be polite. I will provide you with how gavin text to others so you can learn. this is gavin's imessage text. Here is the provided text content you should carefully mimic: ` + content  },
        { role: "user", content: req.query.content },
      ],
      temperature: 1.5,
    },
    // {
    //     proxy: false,
    //     httpAgent: new HttpsProxyAgent("http://127.0.0.1:1087"),
    //     httpsAgent: new HttpsProxyAgent("http://127.0.0.1:1087"),
    //   }
  );

  // const response = await openai.createCompletion(
    // {
    //   model: "text-davinci-003",
    //   prompt: "how are you",
    //   max_tokens: 300,
    //   temperature: 1.9,
    // },
    // {
    //   proxy: false,
    //   httpAgent: new HttpsProxyAgent("http://127.0.0.1:1087"),
    //   httpsAgent: new HttpsProxyAgent("http://127.0.0.1:1087"),
    // }
  // );

  res.status(200).json(response.data);
}

