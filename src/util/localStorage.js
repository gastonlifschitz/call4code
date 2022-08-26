export function saveJSONToLocal(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

export function getJSONFromLocal(key) {
  return JSON.parse(localStorage.getItem(key));
}
