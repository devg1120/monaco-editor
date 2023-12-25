import './style.css'
import * as monaco from 'monaco-editor'
import editorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker'
import jsonWorker from 'monaco-editor/esm/vs/language/json/json.worker?worker'
import cssWorker from 'monaco-editor/esm/vs/language/css/css.worker?worker'
import htmlWorker from 'monaco-editor/esm/vs/language/html/html.worker?worker'
import tsWorker from 'monaco-editor/esm/vs/language/typescript/ts.worker?worker'

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

monaco.editor.create(document.getElementById('container'), {
  value: "function hello() {\n\talert('Hello world!');\n}", // テキストエディタの初期値
  language: 'javascript', // テキストエディタの言語
	lineNumbers: "off", // テキストエディタの行番号を表示するかどうか
	roundedSelection: true, // 選択範囲を角丸にするかどうか
	scrollBeyondLastLine: false, // テキストエディタの最後の行を超えてスクロールするかどうか
	readOnly: false, // テキストエディタを読み取り専用にするかどうか
	theme: "vs-dark", // テキストエディタのテーマ
})

