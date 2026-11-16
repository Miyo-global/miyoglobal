import { setBlockType } from "@tiptap/pm/commands";
import { Schema } from "@tiptap/pm/model";
import { EditorState, TextSelection } from "@tiptap/pm/state";
import { describe, expect, it } from "vitest";
import { trimBlockEdges } from "./editor-selection";

const schema = new Schema({
  nodes: {
    doc: { content: "block+" },
    paragraph: { group: "block", content: "text*" },
    heading: { group: "block", content: "text*", attrs: { level: { default: 3 } } },
    text: {},
  },
});
// 25 paragraphs "Para 1".."Para 25"; each is 6-7 chars + 2 boundary tokens.
const doc = schema.node("doc", null, Array.from({ length: 25 }, (_, i) => schema.node("paragraph", null, schema.text(`Para ${i + 1}`))));
const start = (n: number) => { let pos = 0; doc.forEach((node, offset, i) => { if (i === n - 1) pos = offset + 1; }); return pos; };
const end = (n: number) => start(n) + doc.child(n - 1).content.size;

/** Apply H3 to the trimmed selection and list which paragraphs (1-based) became headings. */
function h3(anchor: number, head: number, trim = true) {
  let state = EditorState.create({ doc, selection: TextSelection.create(doc, anchor, head) });
  if (trim) state = state.apply(state.tr.setSelection(trimBlockEdges(state.selection)));
  setBlockType(schema.nodes.heading, { level: 3 })(state, (tr) => { state = state.apply(tr); });
  const out: number[] = [];
  state.doc.forEach((n, _o, i) => { if (n.type.name === "heading") out.push(i + 1); });
  return out;
}

describe("trimBlockEdges", () => {
  it("collapsed caret in #21 converts only #21", () => {
    expect(h3(start(21) + 2, start(21) + 2)).toEqual([21]);
    expect(h3(start(21), start(21))).toEqual([21]);
  });

  it("range end-of-#20 to start-of-#21 (looks like a caret at the start of #21) converts only #21", () => {
    expect(h3(end(20), start(21), false)).toEqual([20, 21]); // the bug, untrimmed
    expect(h3(end(20), start(21))).toEqual([21]);
    expect(h3(start(21), end(20))).toEqual([20]); // backwards: caret is drawn at the end of #20
  });

  it("real multi-block selection converts every selected block", () => {
    expect(h3(start(20) + 2, start(22) + 3)).toEqual([20, 21, 22]);
    expect(h3(start(20), end(22))).toEqual([20, 21, 22]);
  });

  it("drops only edge-touched blocks from a longer range", () => {
    expect(h3(end(19), start(23))).toEqual([20, 21, 22]);
  });
});
