import test from "node:test";
import { strict as assert } from "node:assert";
import { ARC, arc } from "../../src/arc.js";

test("exports", (t) => {
	t.test("exports ARC class", () => {
		assert.ok(typeof ARC === "function");
	});

	t.test("exports arc factory", () => {
		assert.ok(typeof arc === "function");
	});
});
