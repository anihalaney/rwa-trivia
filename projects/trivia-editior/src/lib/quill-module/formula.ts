import Quill from 'quill';
const Module = Quill.import('core/module');
const Embed = Quill.import('blots/embed');

class FormulaBlot extends Embed {
  static blotName;
  static className;
  static tagName;

  text;
  statics;
  className;
  tagName;

  static create(value) {
    const node = super.create(value);
    if (typeof value === 'string') {
      (window as any).katex.render(value, node, {
        throwOnError: false,
        errorColor: '#f00'
      });
      node.setAttribute('data-value', value);
    }
    return node;
  }

  static value(domNode) {
    return domNode.getAttribute('data-value');
  }

  constructor(node) {
    super(node);
    this.text = this.statics.value(node);
  }

  length() {
    return this.text.length;
  }

  value() {
    return this.text;
  }
}

FormulaBlot.blotName = 'formula';
FormulaBlot.className = 'ql-formula';
FormulaBlot.tagName = 'SPAN';


class Formula extends Module {

  static register() {
    Quill.register(FormulaBlot, true);
  }

  constructor() {
    console.log('quill retister');
    super();
    if ((window as any).katex == null) {
      throw new Error('Formula module requires KaTeX.');
    }
  }
}


export { FormulaBlot, Formula as default };
