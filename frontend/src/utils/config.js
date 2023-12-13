export const api = "http://localhost:5000/api";
export const uploads = "http://localhost:5000/uploads";

export const requestConfig = (method, data, token = null, image = null) => {
  let config;

  if (image) {
    config = {
      method,
      headers: {},
      body: data
    };
  } else if (method === "DELETE" || data === null) {
    config = {
      method,
      headers: {}
    };
  } else {
    config = {
      method,
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    };
  }
  
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
};
