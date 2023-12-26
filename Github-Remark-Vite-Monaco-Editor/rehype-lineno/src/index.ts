import type { Plugin } from 'unified';
import type { Root, Element, Comment, Properties, Literal } from 'hast';
import { visit } from 'unist-util-visit';
import { propertiesHandle, nextChild, prevChild, getCommentObject } from './utils.js';

export type RehypeAttrsOptions = {
  properties?: 'data' | 'string' | 'attr';
  codeBlockParames?: boolean;
}

const rehypeAttrs: Plugin<[RehypeAttrsOptions?], Root> = (options = {}) => {
  const { properties = 'data', codeBlockParames = true } = options;
  return (tree) => {
    visit(tree, 'element', (node, index, parent) => {
	    /*
	    {
    "start": {
        "line": 92,
        "column": 28,
        "offset": 1437
    },
    "end": {
        "line": 92,
        "column": 44,
        "offset": 1453
    }
}
*/
                const pos  = node.position
                //const start: any = node.position.start;
	        
                console.log("pos:",pos)
                console.log(typeof pos)
                //console.log("start:",start)
                //console.log(node.position['start']['line'])
                //console.log("end:" +node.position.end.line)

/*
      if (codeBlockParames && node.tagName === 'pre' && node && Array.isArray(node.children) && parent && Array.isArray(parent.children) && parent.children.length > 1) {
        const firstChild = node.children[0] as Element;
        if (firstChild && firstChild.tagName === 'code' && typeof index === 'number') {
          const child = prevChild(parent.children as Literal[], index);
          if (child) {
            const attr = getCommentObject(child);
            if (Object.keys(attr).length > 0) {
              node.properties = { ...node.properties, ...{ 'data-type': 'rehyp' } }
              firstChild.properties = propertiesHandle(firstChild.properties, attr, properties) as Properties
            }
          }
        }
      }

      if (/^(em|strong|b|a|i|p|pre|kbd|blockquote|h(1|2|3|4|5|6)|code|table|img|del|ul|ol)$/.test(node.tagName) && parent && Array.isArray(parent.children) && typeof index === 'number') {
        const child = nextChild(parent.children, index, '', codeBlockParames)
        if (child) {
          const attr = getCommentObject(child as Comment)
          if (Object.keys(attr).length > 0) {
            node.properties = propertiesHandle(node.properties, attr, properties) as Properties
          }
        }
      }
      */

    });
  }
}


export default rehypeAttrs
