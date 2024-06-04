// export const verifyUser = async (e, ResponseError, reqFunction) => {
//   e.preventDefault();
//   try {
//     const response = await reqFunction(
//       JSON.stringify(Object.fromEntries(new FormData(e.target)))
//     );
//     if (!response.ok) {
//       throw new ResponseError("Bad Fetch Response", response);
//     }
//     const result = await response.json();
//     sessionStorage.setItem(
//       "location",
//       JSON.stringify(Object.fromEntries(new FormData(e.target)).location)
//     );
//     sessionStorage.setItem(
//       "unit",
//       JSON.stringify(Object.fromEntries(new FormData(e.target)).unit)
//     );
//     sessionStorage.setItem("token", JSON.stringify(result.token));
//     return response;
//   } catch (err) {
//     return err.response;
//   }
// };
//
export async function loginUser(data) {
  const response = await fetch("/api/users/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: data,
  });
  return response;
}
export async function registerUserReq(token, data) {
  const response = await fetch("/api/users/registration", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-type": "application/json",
    },
    body: data,
  });
  return response;
}
export class ResponseError extends Error {
  constructor(message, res) {
    super(message);
    this.response = res;
  }
}

export async function logoutRequest(token) {
  const response = await fetch("/api/user/logout", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-type": "application/json",
    },
  });
  return response;
}
// AUTH GET LOGIN
export async function getUsername(body) {
  const response = await fetch("/api/users/getUser", {
    method: "POST",
    headers: {
      "Content-type": "application/json",
    },
    body,
  });
  return response;
}
