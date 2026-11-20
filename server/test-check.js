import assert from "node:assert/strict";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import bcrypt from "bcryptjs";
import { computeInitials, formatCompactNumber } from "./utils/format.js";
import { signToken } from "./middleware/auth.js";
import { parseAndValidateMatchmaking } from "./routes/matchmaking.js";
import { app } from "./index.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function runChecks() {
  // 1. Express app loaded
  assert.equal(typeof app, "function", "Express app harus ter-export");

  // 2. Schema SQL has required tables & FK indexes
  const schema = await fs.readFile(path.resolve(__dirname, "schema.sql"), "utf8");
  for (const tbl of [
    "users",
    "riset",
    "riset_likes",
    "comments",
    "collaborations",
    "nda_agreements",
    "messages",
    "notifications",
  ]) {
    assert.ok(schema.includes(`create table if not exists ${tbl}`), `Tabel ${tbl} tidak ditemukan di schema.sql`);
    assert.ok(schema.includes(`alter table ${tbl} enable row level security`), `RLS wajib aktif pada tabel ${tbl}`);
  }
  assert.ok(schema.includes("generated always as identity primary key"), "PK harus menggunakan bigint identity");
  assert.ok(schema.includes("riset_author_id_idx"), "Index FK riset.author_id wajib ada");

  // 3. Matchmaking JSON validation rejects hallucinated IDs, deduplicates, clamps scores, sorts desc
  const catalog = new Map([
    ["1", { id: "1", judul: "Irigasi IoT" }],
    ["5", { id: "5", judul: "Irigasi Solar" }],
  ]);
  const raw = JSON.stringify({
    reply: "Dua riset cocok untuk kebutuhan irigasi.",
    matches: [
      { risetId: "999", score: 99, reason: "Halusinasi ID" },
      { risetId: "5", score: 85, reason: "Cocok untuk off-grid" },
      { risetId: "1", score: 120, reason: "Sangat cocok" },
      { risetId: "1", score: 50, reason: "Duplikat" },
    ],
  });
  const validated = parseAndValidateMatchmaking(raw, catalog);
  assert.equal(validated.matches.length, 2);
  assert.equal(validated.matches[0].risetId, "1");
  assert.equal(validated.matches[0].score, 100);
  assert.equal(validated.matches[1].risetId, "5");
  assert.equal(validated.matches[1].score, 85);

  // 4. Format helpers
  assert.equal(computeInitials("Eka Wahyu M"), "EM");
  assert.equal(computeInitials("RisetIn"), "RI");
  assert.equal(formatCompactNumber(4200), "4.2rb");
  assert.equal(formatCompactNumber(500), "500");

  // 5. Auth crypto roundtrip
  process.env.JWT_SECRET = process.env.JWT_SECRET || "test-secret-key-for-self-check-only";
  const hash = await bcrypt.hash("password123", 4);
  assert.equal(await bcrypt.compare("password123", hash), true);
  assert.equal(await bcrypt.compare("wrong", hash), false);
  const token = signToken({ id: 1, role: "mahasiswa", email: "test@ub.ac.id" });
  assert.equal(token.split(".").length, 3);

  console.log("Semua self-check backend LULUS!");
}

runChecks().catch((err) => {
  console.error("Self-check GAGAL:", err);
  process.exit(1);
});
