// Simple in-memory demo auth to align with frontend expectations
const users = [];

function signup(req, res) {
  const { name, email, password, role } = req.body || {};
  if (!email || !password) return res.status(400).json({ message: "Missing fields" });
  if (users.some((u) => u.email === email)) return res.status(409).json({ message: "User already exists" });
  const newUser = { id: Date.now().toString(), name: name || "", email, password, role: role || "user" };
  users.push(newUser);
  const user = { id: newUser.id, name: newUser.name, email: newUser.email, role: newUser.role };
  res.status(201).json({ user, token: newUser.id });
}

function login(req, res) {
  const { email, password } = req.body || {};
  const found = users.find((u) => u.email === email && u.password === password);
  if (!found) return res.status(401).json({ message: "Invalid credentials" });
  const user = { id: found.id, name: found.name, email: found.email, role: found.role };
  res.json({ user, token: found.id });
}

function me(req, res) {
  const token = (req.headers.authorization || "").replace("Bearer ", "");
  const found = users.find((u) => u.id === token);
  if (!found) return res.status(401).json({ message: "Unauthorized" });
  const user = { id: found.id, name: found.name, email: found.email, role: found.role };
  res.json({ user });
}

module.exports = { signup, login, me };


