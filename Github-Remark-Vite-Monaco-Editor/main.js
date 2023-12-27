import * as monaco from "monaco-editor";
import editorWorker from "monaco-editor/esm/vs/editor/editor.worker?worker";
import jsonWorker from "monaco-editor/esm/vs/language/json/json.worker?worker";
import cssWorker from "monaco-editor/esm/vs/language/css/css.worker?worker";
import htmlWorker from "monaco-editor/esm/vs/language/html/html.worker?worker";
import tsWorker from "monaco-editor/esm/vs/language/typescript/ts.worker?worker";

import { unified } from "unified";
//import {stream} from 'unified-stream'
import remarkParse from "remark-parse";
import remarkFrontmatter from "remark-frontmatter";

import remarkSlug from "remark-slug";
import remarkToc from "remark-toc";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
//import remarkPrism from 'remark-prism'

import rehypeSanitize from "rehype-sanitize";

import rehypeAutolinkHeadings from "rehype-autolink-headings";

import hljs from "remark-highlight.js";
import "highlight.js/styles/default.css";

import rehypeDocument from 'rehype-document'
import rehypeFormat from "rehype-format";
import rehypeStringify from "rehype-stringify";

import {inspect} from 'unist-util-inspect';
import rehypeAttrs from 'rehype-attr';
import rehypeLineno from 'rehype-lineno';


self.MonacoEnvironment = {
  getWorker(_, label) {
    if (label === "json") {
      return new jsonWorker();
    }
    if (label === "css" || label === "scss" || label === "less") {
      return new cssWorker();
    }
    if (label === "html" || label === "handlebars" || label === "razor") {
      return new htmlWorker();
    }
    if (label === "typescript" || label === "javascript") {
      return new tsWorker();
    }
    return new editorWorker();
  },
};

//<link href="/neos-normalize.css" rel="stylesheet"></link>
//<link rel="stylesheet" href="/markdown.css">
//<link href="/github-markdown-css/github-markdown-dark.css" rel="stylesheet"></link>
//<link href="/github-markdown-css/github-markdown-light.css" rel="stylesheet"></link>

let markdown = `
<link href="/github-markdown-css/github-markdown-light.css" rel="stylesheet"></link>

This is a title
====
<!--rehype:style=color:green;-->

[github:rehype-attr](https://github.com/jaywcjlove/rehype-attr) <!--rehype:rel=external-->


# This is a title  
<!--rehype:style=color:red&mdline=80-->

# This is a title  
<!--rehype:mdline=80-->


# はじめてのRemark 
<!--rehype:mdline=80-->

**太字**_斜体_テキスト

> Blockquote


<!-- comment -->

\`\`\`javascript
import {remark} from 'remark'
import remarkPresetLintConsistent from 'remark-preset-lint-consistent'
import remarkPresetLintRecommended from 'remark-preset-lint-recommended'
import {reporter} from 'vfile-reporter'

const file = await remark()
  .use(remarkPresetLintConsistent)
  .use(remarkPresetLintRecommended)
  .process('1) Hello, _Jupiter_ and *Neptune*!')

console.error(reporter(file))

\`\`\`


---

\`Inline code\` with backticks

\`\`\`
   class
     aaa
     bbb
\`\`\`

## Hello world!
### TESTABC

- MEMO
- MEMO

<span style=\"color: red; \">赤文字</span>
<span style=\"color: red; background-color: yellow;\">赤文字</span>
<span style=\"color: red; background-color: blue;\">赤文字</span>

>> aaaaaaaaaaaaaa
>> bbbbbbbbbbbbbb
>> cccccccccccccc

* リスト1
  * リスト1-2  
* リスト2

1. リスト1
    1. リスト1-1 
    2. リスト1-2  
2. リスト2


- [ ] リスト1
- [x] リスト2

~~打ち消し~~


\`\`\`html
   <div class="radioWave">
      <p>迷いの中あてなく見上げた空彩る星たちが</p>
      <p>嘘みたいに晴れた朝に繋がることを教えてくれた</p>
   </div>
\`\`\`


| Left align | Right align | Center align |
|:-----------|------------:|:------------:|
| This       |        This |     This     |
| column     |      column |    column    |
| will       |        will |     will     |
| be         |          be |      be      |
| left       |       right |    center    |
| aligned    |     aligned |   aligned    |

`;

const placeholder = document.getElementById("in");

const editor = monaco.editor.create(placeholder, {
  value: markdown,
  language: "markdown",
  lineNumbers: "on",
  roundedSelection: true,
  scrollBeyondLastLine: false,
  readOnly: false,
  theme: "vs-dark",
  automaticLayout: false,
});

editor.getModel().onDidChangeContent((event) => {
  console.log("editor modify");
  //console.log(editor.getValue());
});

editor.onDidChangeCursorPosition(e => {
   console.log("cur pos:",editor.getPosition());
});

const parent = placeholder.parentElement;

window.addEventListener("resize", () => {
  editor.layout();
});

let button = document.getElementById("OK");
button.addEventListener("click", buttonClick);

let input = document.getElementById("in");
let output = document.getElementById("out");

function buttonClick() {
  let value = editor.getValue();
  md2html(value);
}

let edit = document.getElementById("EDIT");
edit.addEventListener("click", editClick);

function editClick() {
  if (output.style.left == "0%") {
    output.style.left = "50%";
  } else {
    output.style.left = "0%";
  }
}

let sync = document.getElementById("SYNC");
sync.addEventListener("click", mouseoverEventSetting );

let move = document.getElementById("IVEW");
move.addEventListener("click", elementScrollintoView );

function mouseoverEventSetting() {
     let body = document.getElementById("out");

     function walkTheDOM(node, func) {
         func(node);
         node = node.firstChild;
         while (node) {
             walkTheDOM(node, func);
             node = node.nextSibling;
         }
     }
     function sync(event) {
	     event.stopPropagation()
             const line = parseInt(event.target.getAttribute("start_line"));

             //editor.revealLine(line);
             editor.revealLineInCenter(line);
	     editor.setPosition({
                 lineNumber: line,
                 column: 0,
             });

     }

     walkTheDOM(body, function (node) {
         if (node.nodeType === 1) { 
               node.addEventListener('click', sync);
	 }
     });



}


let last_time_sync_node = null;

function elementScrollintoView(){
   const pos = editor.getPosition();
   const line = pos?.lineNumber;

     let body = document.getElementById("out");

     function walkTheDOM(node, func) {
         func(node);
         node = node.firstChild;
         while (node) {
             walkTheDOM(node, func);
             node = node.nextSibling;
         }
     }


     walkTheDOM(body, function (node) {
         if (node.nodeType === 1) { 

             const start_line = parseInt(node.getAttribute("start_line"));
             const end_line   = parseInt(node.getAttribute("end_line"));

             if ( line >= start_line && end_line >= line ) {
		    node.scrollIntoView(
                             {
                               behavior: "smooth",
                               block: "center",
                               inline: "start"
                             }
		            );
                    node.style.backgroundColor = "red";
                    if (last_time_sync_node != null) {
		        last_time_sync_node.style.backgroundColor = "";
		    }
		    last_time_sync_node = node;
                    return;
	     }

	 }
     });

}

function md2html(input) {
  //reference
  // https://zenn.dev/yoshiishunichi/articles/667120b3d0c9d2
  // http://github.com/remarkjs/remark-rehype
  /*
unified()
  .use(hljs)
  .use(remarkParse)
  .use(remarkGfm)
  .use(remarkToc)
  //.use(remarkToc)
  .use(remarkRehype,  {allowDangerousHtml: true})
  //.use(rehypeDocument, {title: 'Contents'})
  //.use(rehypeFormat)
 //   .use(rehypeSanitize)
  .use(rehypeStringify,  {allowDangerousHtml: true})
  .process(input)
  .then((file) => {
    console.log(file);
    //output.innerHTML = file + "<a style=\"color: red; \">赤文字</a>";
    output.innerHTML = file ;
  })
*/

  const processor = unified()
    // markdown ->  md-ast
    .use(remarkParse, { commonmark: true, gfm: true, pedantic: true })
    //.use(remarkFrontmatter, [{ type: "yaml", marker: "-", anywhere: false }])
    //.use(remarkSlug)
    .use(remarkGfm)
    .use(hljs)
    //.use(remarkPrism)
    .use(remarkToc, { heading: "目次", tight: true })
    // md-ast -> html-ast
    .use(remarkRehype, { allowDangerousHtml: true })
    //.use(rehypeAutolinkHeadings, {
    //  behavior: "prepend",
    //  properties: { className: ["header-link"] },
    //  content: {
    //    type: "element",
    //    tagName: "span",
    //    properties: { className: ["header-link-mark"] },
    //    children: [],
    //  },
    //})
    .use(rehypeDocument)
    .use(rehypeFormat, { indent: 3, indentInitial: true })
    .use(rehypeAttrs, { properties: 'attr' })
    .use(rehypeLineno, { properties: 'attr' })

    // html-ast -> html
    .use(rehypeStringify, { allowDangerousHtml: true })
	;

  //const result = processor.processSync(input);
  //console.log(result.value);

  const mdast = processor.parse(input);
  console.log(inspect(mdast));
  const hast = processor.runSync(mdast);
  console.log(inspect(hast));
  const html = processor.stringify(hast);
	console.log(html)
  output.innerHTML = html

  //mouseoverEventSetting(output);


}
