import { Node, Parent, Literal } from "unist";

export interface Text extends Node {
  type: "text";
  value: string;
}

export function isParent(node: Node): node is Parent {
  return Array.isArray(node.children);
}

export function isLiteral(node: Node): node is Literal {
  return "value" in node;
}

export function isText(node: Node): node is Text {
  return node.type === "text" && typeof node.value === "string";
}
