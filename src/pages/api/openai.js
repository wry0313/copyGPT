import { Configuration, OpenAIApi } from "openai";
import { HttpsProxyAgent } from "https-proxy-agent";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

export default async function handler(req, res) {

    
  const response = await openai.createChatCompletion(
    {
      model: "gpt-3.5-turbo-16k",
      messages: [
        { role: "system", content: "" },
        { role: "user", content: `${req.query.content}` },
      ],
      temperature: 1.3,
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
