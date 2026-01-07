import axios from "axios";

const instance = axios.create({
  baseURL: "https://3p63133b-8080.inc1.devtunnels.ms/api/",
  withCredentials: true,
  timeout: 5000,
  headers: {
    "Content-Type": "application/json",
  },
});

export default instance;