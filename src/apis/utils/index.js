import axios from "axios";

const backUrl = process.env.REACT_APP_BACKEND_URL;

const axiosApi = (url, options) => {
  const instance = axios.create({ baseURL: url });
  return instance;
};

export const defaultInstance = axiosApi(backUrl);
