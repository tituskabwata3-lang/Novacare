import { listClients } from "../../../lib/clients";
export default function handler(req, res) {
  const secret = req.headers["x-admin-secret"];
  if (!secret || secret !== process.env.ADMIN_SECRET) return res.status(401).json({ error: "Unauthorized" });
  return res.status(200).json({ clients: listClients() });
}
