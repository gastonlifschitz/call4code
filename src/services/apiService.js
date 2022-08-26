import http from "./httpService";

export function saveTransaction(data) {
  return http.post(`/api/transactions`, data);
}

export function saveObservation(data) {
  return http.post(`/api/observations`, data);
}

export function getHospitals() {
  return http.get(`/api/hospitals`);
}

export function getHospitalLastInspection(_hospital) {
  return http.get(`/api/transactions/lastUpdate/${_hospital}`);
}

export function getUserById(_user) {
  return http.get(`/api/users/${_user}`);
}

export function getSuppliesByHospital(_hospital) {
  return http.get(`/api/supplies/byhospital/${_hospital}`);
}
export function getBedsByHospital(_hospital) {
  return http.get(`/api/beds/byhospital/${_hospital}`);
}
export function getStaffByHospital(_hospital) {
  return http.get(`/api/staffs/byhospital/${_hospital}`);
}

export function getTypes(type) {
  return http.get(`/api/types/${type}`);
}
export function getBedSubtotals(_hospital) {
  return http.get(`/api/beds/subtotals/${_hospital}`);
}

export function getDashboard() {
  return http.get("/api/hospitals/dash");
}
