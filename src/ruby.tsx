import type { Plugin } from 'unified';
import { visit } from 'unist-util-visit';

import './ruby.css'

interface GrowiNode extends Node {
  name?: string;
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
      
      // console.log(`ruby plugin: node=`, n);
      
      const keys = Object.keys(n.attributes);

      // console.log(keys);

      const baseText = keys[0]?.trim();
      const rubyText = keys[1]?.trim();
      
      // 元のノードの参照を壊さずに、中身を丸ごと差し替える
      Object.keys(n).forEach((key) => {
        delete (n as any)[key]; // ここは anny キャストで安全に delete
      });
      n.type = 'html';
      n.value = `<ruby>${baseText}<rp>(</rp><rt>${rubyText}</rt><rp>)</rp></ruby>`;
    });
  };
};
