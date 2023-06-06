import axios from "axios";

const TOKEN = "chuoq2hr01qphnn2cog0chuoq2hr01qphnn2cogg";
let options = {
  baseURL: "https://finnhub.io/api/v1",
  params: {
    token: TOKEN,
  },
};

export default axios.create(options);
