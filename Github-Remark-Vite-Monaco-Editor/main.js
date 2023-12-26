//import './style.css'
import * as monaco from 'monaco-editor'
import editorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker'
import jsonWorker from 'monaco-editor/esm/vs/language/json/json.worker?worker'
import cssWorker from 'monaco-editor/esm/vs/language/css/css.worker?worker'
import htmlWorker from 'monaco-editor/esm/vs/language/html/html.worker?worker'
import tsWorker from 'monaco-editor/esm/vs/language/typescript/ts.worker?worker'
/*
onst unified = require('unified');
const remarkParse = require('remark-parse');
const remarkFrontmatter = require('remark-frontmatter');
const remarkSlug = require('remark-slug');
const remarkToc = require('remark-toc');
const remarkRehype = require('remark-rehype');
const rehypeAutolinkHeadings = require('rehype-autolink-headings');
const rehypePrism = require('@neos21/rehype-prism');
const rehypeStringify = require('rehype-stringify');
const rehypeFormat = require('rehype-format');
*/

import {unified} from 'unified'
//import {stream} from 'unified-stream'
import remarkParse from 'remark-parse'
import remarkFrontmatter from 'remark-frontmatter'

import remarkSlug from 'remark-slug'
import remarkToc from 'remark-toc'
import remarkGfm from 'remark-gfm'
import remarkRehype from 'remark-rehype'

import rehypeSanitize from 'rehype-sanitize'

import rehypeAutolinkHeadings from 'rehype-autolink-headings'

import hljs from "remark-highlight.js";
import 'highlight.js/styles/default.css';


//import rehypeDocument from 'rehype-document'
import rehypeFormat from 'rehype-format'
import rehypeStringify from 'rehype-stringify'

self.MonacoEnvironment = {
  getWorker(_, label) {
    if (label === 'json') {
      return new jsonWorker()
    }
    if (label === 'css' || label === 'scss' || label === 'less') {
      return new cssWorker()
    }
    if (label === 'html' || label === 'handlebars' || label === 'razor') {
      return new htmlWorker()
    }
    if (label === 'typescript' || label === 'javascript') {
      return new tsWorker()
    }
    return new editorWorker()
  }
}

//<link href="/neos-normalize.css" rel="stylesheet"></link>
//<link rel="stylesheet" href="/markdown.css">
//<link href="/github-markdown-css/github-markdown-dark.css" rel="stylesheet"></link>
//<link href="/github-markdown-css/github-markdown-light.css" rel="stylesheet"></link>

let markdown = `
<link href="/github-markdown-css/github-markdown.css" rel="stylesheet"></link>

> Blockquote

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

const placeholder = document.getElementById('in')

const editor = monaco.editor.create(placeholder, {
  value : markdown,
  language: 'markdown', 
	lineNumbers: "on", 
	roundedSelection: true, 
	scrollBeyondLastLine: false, 
	readOnly: false, 
	theme: "vs-dark", 
	automaticLayout: false,
})


const parent = placeholder.parentElement

window.addEventListener('resize', () => {
  editor.layout()

})



let button = document.getElementById('OK');
button.addEventListener('click', buttonClick);

let output = document.getElementById('out');

function buttonClick(){
    console.log('Click');
    let value = editor.getValue();
    console.log(value);
    md2html(value);
}


function md2html(input){
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
     .use(hljs)
    .use(remarkParse, { commonmark: true, gfm: true, pedantic: true })
    .use(remarkFrontmatter, [{ type: 'yaml', marker: '-', anywhere: false }])
    .use(remarkSlug)
    .use(remarkGfm)
    .use(remarkToc, { heading: '目次', tight: true })
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeAutolinkHeadings, {
      behavior: 'prepend',
      properties: { className: ['header-link'] },
      content: {
        type: 'element',
        tagName: 'span',
        properties: { className: ['header-link-mark'] },
        children: []
      }
    })
    .use(rehypeStringify, { allowDangerousHtml: true })
    .use(rehypeFormat, { indent: 2, indentInitial: true });
  const result = processor.processSync(input);

  output.innerHTML = result ;




}
