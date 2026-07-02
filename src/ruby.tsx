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
      const attributesKeys = Object.keys(n.attributes || {});
      const rubyText = attributesKeys.length > 0 ? attributesKeys[0].trim() : '';

      console.log(`ruby plugin: baseText="${baseText}", rubyText="${rubyText}"`);
      n.type = 'html';
      n.value = `<ruby>${baseText}<rp>(</rp><rt>${rubyText}</rt><rp>)</rp></ruby>`
    });
  };
};
