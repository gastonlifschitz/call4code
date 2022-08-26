import axios from 'axios';
import http from "./httpService";
import jwtDecode from "jwt-decode";
const apiEndpoint = "/api/auth";
const tokenKey = "covid19-token";

export function getHospitals() {
    return axios.get("/api/hospitals");
}
export function getStaff() {
    return axios.get("/api/staff");
}
export function getBeds() {
    return axios.get("/api/beds");
}
export function getSupplies() {
    return axios.get("/api/supplies");
} 