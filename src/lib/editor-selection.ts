import { Selection, TextSelection } from "@tiptap/pm/state";

/**
 * Drops blocks that a text range only touches at their edge: a range ending at offset 0 of a block, or starting at the
 * very end of one. Block commands (setBlockType, wrapIn, wrapInList) otherwise convert those blocks too, so a caret that
 * looks like it sits at the start of paragraph 21 but is really the range "end of 20 -> start of 21" (a tiny drag,
 * Shift+click or Shift+Left) turned both paragraphs into headings. A range covering no text collapses to its head.
 */
export function trimBlockEdges(sel: Selection): Selection {
  if (!(sel instanceof TextSelection) || sel.$from.sameParent(sel.$to)) return sel;
  const doc = sel.$from.doc;
  let { from, to } = sel;
  if (sel.$to.parentOffset === 0) to = Selection.findFrom(doc.resolve(sel.$to.before()), -1, true)?.to ?? to;
  if (sel.$from.parentOffset === sel.$from.parent.content.size) from = Selection.findFrom(doc.resolve(sel.$from.after()), 1, true)?.from ?? from;
  if (from === sel.from && to === sel.to) return sel;
  return from < to ? TextSelection.create(doc, from, to) : TextSelection.create(doc, sel.head);
}
