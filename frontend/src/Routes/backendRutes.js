const server = "http://localhost:5000";
import routes from "./Routes.json";

const typedRouteSchema = routes;

export async function appRequest(type, requestType, inputs) {
  return new Promise(async (resolve, reject) => {
    try {
      let request = typedRouteSchema[type][requestType];
      let { method, headers, body, query } = request;
      let url = request.url; // Get the URL from Routes.json
      let id;

      // If the route expects an :id parameter but the caller didn't provide one,
      // default to the reserved "me" token so the server can resolve the user's id
      // from the auth token. This prevents accidentally sending the literal ':id'.
      if (request.url && request.url.includes(":id")) {
        if (inputs && inputs.id) {
          id = inputs.id; // Store the ID separately
          url = url.replace(":id", id); // Substitute :id in the URL
          delete inputs.id; // Remove id from inputs before sending as body/query
        } else {
          // Default to 'me' so backend can map to authenticated user
          url = url.replace(":id", "me");
          if (inputs && inputs.id) {
            // Ensure inputs.id is removed if it was explicitly passed but resolved to 'me'
            delete inputs.id;
          }
        }
      }

      if (headers) {
        // Always attempt to add Authorization header if a token exists
        const token = localStorage.getItem("auth-token");
        if (token) {
          headers["Authorization"] = "Bearer " + token;
        }
      }

      let response;

      // Log the URL after ID substitution (if any)
      console.log("Constructed URL:", `${server}/${url}`);

      switch (method) {
        case "GET":
          if (inputs && inputs.id) {
            delete inputs.id; // Ensure id is not sent as a query parameter for GET requests
          }
          let queries = "";
          if (query) {
            if (inputs) {
              queries = "";
              Object.entries(inputs).forEach(([key, value]) => {
                queries += `${key}=${value}&`;
              });
            } else {
              // If there are 'query' definitions in Routes.json but no 'inputs' are provided for a GET request,
              // we should still proceed, but the queries string will remain empty.
              // If this condition implies that inputs *must* be provided, the logic needs adjustment.
              // For now, removing the reject to allow GETs without inputs if 'query' is defined but inputs aren't.
              // reject("No inputs provided");
            }
          }
          response = await getRequest(url, headers, queries);
          break;

        case "POST":
          if (inputs) {
            body = inputs;
          } else {
            reject("No inputs provided");
          }
          response = await postRequest(url, headers, body);
          break;

        case "PUT":
          if (!body) {
            body = {};
          }
          // 'id' is already substituted into 'url'
          response = await putRequest(url, headers, inputs);
          break;

        case "DELETE":
          // 'id' is already substituted into 'url'
          response = await deleteRequest(url, headers);
          break;

        default:
          reject("Invalid request method");
      }

      resolve(response);
    } catch (err) {
      reject(err);
    }
  });
}

export function postRequest(url, headers, body) {
  return new Promise(async (resolve, reject) => {
    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...headers,
      },
      body: JSON.stringify(body),
    };

    try {
      const response = await fetch(`${server}/${url}`, requestOptions);
      resolve(response.json());
    } catch (err) {
      reject(err);
    }
  });
}

export function getRequest(url, headers, query) {
  return new Promise(async (resolve, reject) => {
    const requestOptions = {
      method: "GET",
      headers: headers,
    };
    console.log("GET Request Headers:", requestOptions.headers); // Add this line
    try {
      if (query) query = "?" + query;
      const response = await fetch(`${server}/${url}${query}`, requestOptions);
      resolve(response.json());
    } catch (err) {
      reject(err);
    }
  });
}

export function putRequest(url, headers, data) {
  // 'id' parameter removed
  return new Promise(async (resolve, reject) => {
    const requestOptions = {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        ...headers,
      },
      body: JSON.stringify(data),
    };
    console.log("PUT Request Headers:", requestOptions.headers);
    try {
      const response = await fetch(`${server}/${url}`, requestOptions); // Removed '/${id}'
      resolve(response.json());
    } catch (err) {
      reject(err);
    }
  });
}

export function deleteRequest(url, headers) {
  // 'id' parameter removed
  return new Promise(async (resolve, reject) => {
    const requestOptions = {
      method: "DELETE",
      headers: headers,
    };
    try {
      const response = await fetch(`${server}/${url}`, requestOptions); // Removed '/${id}'
      resolve(response.json());
    } catch (err) {
      reject(err);
    }
  });
}
