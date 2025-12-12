const API_URL = (
  import.meta.env.VITE_API_URL || "http://localhost:5000"
).replace(/\/$/, "");

async function parseJsonSafe(response) {
  try {
    return await response.json();
  } catch (error) {
    return {};
  }
}

export async function postJSON(path, body) {
  const response = await fetch(`${API_URL}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(body),
  });

  const json = await parseJsonSafe(response);

  if (!response.ok) {
    throw new Error(json.message || "Request failed");
  }

  return json;
}

export function getApiOrigin() {
  return API_URL;
}
