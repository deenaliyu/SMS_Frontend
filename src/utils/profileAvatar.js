const palette = [
  ["#0f766e", "#14b8a6"],
  ["#1d4ed8", "#60a5fa"],
  ["#9a3412", "#fb923c"],
  ["#166534", "#4ade80"],
  ["#7c2d12", "#f97316"],
  ["#6d28d9", "#a78bfa"],
];

function hashText(value = "") {
  return String(value)
    .split("")
    .reduce((accumulator, character) => accumulator + character.charCodeAt(0), 0);
}

function getInitials(name = "") {
  const parts = String(name || "")
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2);

  if (parts.length === 0) {
    return "SM";
  }

  return parts.map((part) => part[0].toUpperCase()).join("");
}

export function getProfileAvatar(name = "", role = "") {
  const seed = hashText(`${name}-${role}`);
  const [primary, secondary] = palette[seed % palette.length];
  const initials = getInitials(name);
  const safeRole = String(role || "Member").slice(0, 18);

  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120">
      <defs>
        <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="${primary}" />
          <stop offset="100%" stop-color="${secondary}" />
        </linearGradient>
      </defs>
      <rect width="120" height="120" rx="28" fill="url(#g)" />
      <circle cx="60" cy="44" r="22" fill="rgba(255,255,255,0.22)" />
      <path d="M24 103c7-19 22-29 36-29s29 10 36 29" fill="rgba(255,255,255,0.2)" />
      <text x="60" y="54" text-anchor="middle" font-size="22" font-family="Verdana, sans-serif" font-weight="700" fill="#ffffff">${initials}</text>
      <text x="60" y="96" text-anchor="middle" font-size="10" font-family="Verdana, sans-serif" fill="rgba(255,255,255,0.9)">${safeRole}</text>
    </svg>
  `;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}
