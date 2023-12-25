import unified from "unified";
import { Node } from "unist";
import { VFileCompatible } from "vfile";

const print: unified.Plugin = () => {
  return (tree: Node, file: VFileCompatible) => {
    console.log(tree);
  };
};

export default print;
