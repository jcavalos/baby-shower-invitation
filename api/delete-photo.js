import crypto from "crypto";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  // 1. Verificar que quien llama es el admin (token de Firebase Auth)
  const idToken = (req.headers.authorization || "").replace("Bearer ", "");
  if (!idToken) return res.status(401).json({ error: "no-token" });

  const apiKey = process.env.VITE_FIREBASE_API_KEY;
  const lookup = await fetch(
    `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ idToken }),
    }
  );
  const info = await lookup.json();
  const email = info.users?.[0]?.email;
  if (!email || email !== process.env.ADMIN_EMAIL) {
    return res.status(403).json({ error: "forbidden" });
  }

  // 2. Borrar en Cloudinary con firma
  const { publicId } = req.body || {};
  if (!publicId) return res.status(400).json({ error: "missing-publicId" });

  const timestamp = Math.floor(Date.now() / 1000);
  const signature = crypto
    .createHash("sha1")
    .update(`public_id=${publicId}&timestamp=${timestamp}${process.env.CLOUDINARY_API_SECRET}`)
    .digest("hex");

  const r = await fetch(
    `https://api.cloudinary.com/v1_1/${process.env.VITE_CLOUDINARY_CLOUD_NAME}/image/destroy`,
    {
      method: "POST",
      body: new URLSearchParams({
        public_id: publicId,
        timestamp: String(timestamp),
        signature,
        api_key: process.env.CLOUDINARY_API_KEY,
      }),
    }
  );
  res.status(r.ok ? 200 : 500).json(await r.json());
}