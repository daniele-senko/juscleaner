import test from "node:test";
import assert from "node:assert/strict";
import { sanitizeFileName } from "./fileSanitizer.ts";

test("mantém extensão e remove acentos/caracteres especiais", () => {
  const sanitized = sanitizeFileName("Procuração do João (2024).PDF");
  assert.equal(sanitized, "procuracao_do_joao_2024.pdf");
});

test("usa fallback quando nome-base fica vazio", () => {
  const sanitized = sanitizeFileName("...pdf");
  assert.equal(sanitized, "arquivo.pdf");
});

test("funciona sem extensão", () => {
  const sanitized = sanitizeFileName("  ###  ");
  assert.equal(sanitized, "arquivo");
});
