// SUPPLIER
export async function addSupplierRequest(token, data) {
  const response = await fetch("/api/suppliers", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-type": "application/json",
    },
    body: data,
  });

  return response;
}

export const getSuppliersRequest = async (token) => {
  const response = await fetch("/api/suppliers", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-type": "application/json",
    },
  });
  return response;
};

// SUPPLY
export async function addSupplyRequest(token, data) {
  const response = await fetch("/api/supply", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-type": "application/json",
    },
    body: data,
  });

  return response;
}

export const deleteSupplyRequest = async (token, id) => {
  const response = await fetch(`/api/supply/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-type": "application/json",
    },
  });
  return response;
};
export const getSupplyRequest = async (token, object) => {
  const queryString = Object.keys(object)
    .map((key) => `${key}=${object[key]}`)
    .join("&");
  const response = await fetch(`/api/supply?${queryString}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-type": "application/json",
    },
  });
  return response;
};
