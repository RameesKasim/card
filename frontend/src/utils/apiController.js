import axios from "axios";

// base url

export const endpoint = {
  dev: "http://localhost:5000",
  live: "https://server.barracudites.com",
};
const BASE_URL = endpoint.live;

// token interceptors axios

axios.interceptors.request.use(
  (config) => {
    let token = localStorage.getItem("access-token" || []);
    if (token) {
      config.headers["x-access-token"] = token;
    }
    return config;
  },
  (error) => {
    Promise.reject(error);
  }
);

// axios-401-response-interceptor

axios.interceptors.response.use(
  function (response) {
    return response;
  },
  function (error) {
    if (error && error.response && error.response.status === 401) {
      const handleMenuClick = async () => {
        await localStorage.setItem("isLogin", false);
        await localStorage.removeItem("access-token");
        window.location.href = "/login";
      };
      handleMenuClick();
    } else {
      return Promise.reject(error.response);
    }
  }
);

// get api call axios

export const get = (url) => {
  return axios.get(BASE_URL + url);
};

// post api call axios

export const post = (url, data) => {
  return axios.post(BASE_URL + url, data);
};

// put api call axios

export const put = (url, data) => {
  return axios.put(BASE_URL + url, data);
};

// deleteReqeust api call axios

export const deleteReqeust = (url) => axios.delete(BASE_URL + url);

//patch api call

export const patch = (url, data) => {
  return axios.patch(BASE_URL + url, data);
};
