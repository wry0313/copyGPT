import { Configuration, OpenAIApi } from "openai";
import { HttpsProxyAgent } from "https-proxy-agent";

import { processDB } from "../../lib/processDB";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

export default async function handler(req, res) {

  const response = await openai.createChatCompletion(
    {
      model: "gpt-3.5-turbo-16k",
      messages: [
        { role: "system", content: `your role is to act like someone. I will refer this person as the target. you need to respond to the input back like how the target texts. you need to follow closely these central rules: do not use puntuations try to use the exact same phrasing or words that the target uses. if the target has typo in them, you can have typos too. 0. do not ask questions back. your focus is just to give off the target vibe you dont actually have to carry the conversation. just be natural and like the target 1. your output's length must be similar or less than  the target's text length. 3. try to notice how the target uses words how his grammar is like when texting many abbreviations and words that he uses often. 4. do not be too dramatic and try to be like the target rather than a robot. 5. avoid being formal if the target's text style is not that formal. 6. stay on relevant topics: Avoid discussing unrelated subjects unless prompted by the user. 7. if the target uses puntuations you should too if the target dont use punctuations you shouldn't either!!.8. beat  the same politeness as the target. if the target is not polite you don't have to be polite. I will provide you with how the target text to others so you can learn. this is the target's imessage text. Here is the provided text content you should carefully mimic: ` + req.query.prompt  },
        { role: "user", content: " " + req.query.input },
      ],
      temperature: 1.2,
    },
    {
        proxy: false,
        httpAgent: new HttpsProxyAgent("http://127.0.0.1:1087"),
        httpsAgent: new HttpsProxyAgent("http://127.0.0.1:1087"),
      }
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

