
import { Configuration, OpenAIApi } from "openai";
import { HttpsProxyAgent } from "https-proxy-agent";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);
console.log(configuration)


export default async function handler(req, res) {

  res.status(200).json(configuration);
}
