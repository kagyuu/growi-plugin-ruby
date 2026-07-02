import type { Plugin } from 'unified';
import { visit } from 'unist-util-visit';

import './ruby.css'

interface GrowiNode extends Node {
  name: string;
  type: string;
  attributes: {[key: string]: string}
  children: GrowiNode[];
  value: string;
}

export const plugin: Plugin = function() {
  return (tree) => {
    visit(tree, (node) => {
      const n = node as unknown as GrowiNode;

      if (n.name !== 'ruby') return;
      
      console.log(`ruby plugin: node=`, n);
      // 2. 「紫陽花（表記）」の取得
      // children配列の最初のテキストノードの value から前後の空白を削る
      const textNode = n.children?.[0];
      const baseText = textNode && textNode.type === 'text' ? textNode.value.trim() : '';

      // 3. 「あじさい（ルビ）」の取得
      // attributes オブジェクトの最初の「キー」を取得
      const rubyText = n.attributes['rb']?.trim();

      // UUIDを計算する
      const uuid = "today-" + Math.random().toString(36).slice(2);

      // GrowiNode の value には、複雑な HTML を直接書けないため、id 属性を付与してから
      // DOM 上で書き換える方法を取る
      n.type = 'html';
      n.value = `<div id="${uuid}"></div>`

      const id = setInterval(() => {
        if (document.querySelector('#' + uuid) != null) {
          document.querySelector('#' + uuid)!.innerHTML = `<ruby>${baseText}<rp>(</rp><rt>${rubyText}</rt><rp>)</rp></ruby>`;
          clearInterval(id);
        }
      }, 100);
    });
  };
};
