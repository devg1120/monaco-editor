import { H } from "mdast-util-to-hast";
import { Node } from "unist";

import all from "../../util/all";

export default function handler(h: H, node: Node) {
  return h(node, "aside", all(h, node));
}
