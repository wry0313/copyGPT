

export default async function handler(req, res) {

    


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

  res.status(200).json("hello");
}
