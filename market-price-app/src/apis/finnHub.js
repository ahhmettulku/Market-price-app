import axios from "axios";

const TOKEN = ["your-api-key"];
let options = {
  baseURL: "https://finnhub.io/api/v1",
  params: {
    token: TOKEN,
  },
};

export default axios.create(options);
