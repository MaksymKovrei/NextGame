const API = "http://localhost:5000/api";

async function safeMessage(res) {
  try {
    const data = await res.json();
    return data?.message;
  } catch {
    return "";
  }
}
