

const server = "http://localhost:5000";
import routes from "./Routes.json";

const typedRouteSchema = routes;

export async function appRequest(type, requestType, inputs) {
    return new Promise(async (resolve, reject) => {
        try {
            let request = typedRouteSchema[type][requestType];
            let { url, method, headers, body, query } = request;

            if (headers) {
                if (headers["Authorization"]) {
                    const token = localStorage.getItem("auth-token");
                    headers["Authorization"] = "Bearer " + token;
                }
            }

            let id;
            let response;

            switch (method) {
                case "GET":
                    let queries = "";
                    if (query) {
                        if (inputs) {
                            queries = "";
                            Object.entries(inputs).forEach(([key, value]) => {
                                queries += `${key}=${value}&`;
                            });
                        } else {
                            reject("No inputs provided");
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
                    } else if (inputs && inputs.id) {
                        id = inputs.id;
                        delete inputs.id;
                        body = inputs;
                    } else {
                        reject("No inputs or id provided");
                    }
                    response = await putRequest(url, headers, id, body);
                    break;

                case "DELETE":
                    if (inputs && inputs.id) {
                        id = inputs.id;
                    } else {
                        reject("No id provided");
                    }
                    response = await deleteRequest(url, headers, id);
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
        try {
            if (query) query = "?" + query;
            const response = await fetch(`${server}/${url}${query}`, requestOptions);
            resolve(response.json());
        } catch (err) {
            reject(err);
        }
    });
}

export function putRequest(url, headers, id, data) {
    return new Promise(async (resolve, reject) => {
        const requestOptions = {
            method: "PUT",
            headers: headers,
            body: JSON.stringify(data),
        };
        try {
            const response = await fetch(`${server}/${url}/${id}`, requestOptions);
            resolve(response.json());
        } catch (err) {
            reject(err);
        }
    });
}

export function deleteRequest(url, headers, id) {
    return new Promise(async (resolve, reject) => {
        const requestOptions = {
            method: "DELETE",
            headers: headers,
        };
        try {
            const response = await fetch(`${server}/${url}/${id}`, requestOptions);
            resolve(response.json());
        } catch (err) {
            reject(err);
        }
    });
}
