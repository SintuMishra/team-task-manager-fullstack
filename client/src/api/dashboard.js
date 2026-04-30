import { http } from "./http";

export const getDashboard = async () => (await http.get("/dashboard")).data;
