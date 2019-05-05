import Quill from 'quill';
const Module = Quill.import('core/module');
import { Component } from '@angular/core';
import { MatBottomSheet, MatBottomSheetRef } from '@angular/material';

const defaults = {
    globalRegularExpression: /https?:\/\/[\S]+/g,
    urlRegularExpression: /(https?:\/\/[\S]+)/
};

export default class QuillAutoLink extends Module {
    // autolinker = new Autolinker();
    quill;
    options;
    toolbar;
    container;
    DEFAULTS;

    constructor(quill, options, public bottomSheet: MatBottomSheet) {
        super(quill, options);
        this.quill = quill;
        this.toolbar = quill.getModule('toolbar');

        options = options || {};
        this.options = { ...defaults, ...options };

        this.DEFAULTS = {
            // tslint:disable-next-line:max-line-length
            buttonIcon: '<svg viewBox="0 0 18 18"> <path class="ql-fill" d="M11.759,2.482a2.561,2.561,0,0,0-3.53.607A7.656,7.656,0,0,0,6.8,6.2C6.109,9.188,5.275,14.677,4.15,14.927a1.545,1.545,0,0,0-1.3-.933A0.922,0.922,0,0,0,2,15.036S1.954,16,4.119,16s3.091-2.691,3.7-5.553c0.177-.826.36-1.726,0.554-2.6L8.775,6.2c0.381-1.421.807-2.521,1.306-2.676a1.014,1.014,0,0,0,1.02.56A0.966,0.966,0,0,0,11.759,2.482Z"></path> <rect class="ql-fill" height="1.6" rx="0.8" ry="0.8" width="5" x="5.15" y="6.2"></rect> <path class="ql-fill" d="M13.663,12.027a1.662,1.662,0,0,1,.266-0.276q0.193,0.069.456,0.138a2.1,2.1,0,0,0,.535.069,1.075,1.075,0,0,0,.767-0.3,1.044,1.044,0,0,0,.314-0.8,0.84,0.84,0,0,0-.238-0.619,0.8,0.8,0,0,0-.594-0.239,1.154,1.154,0,0,0-.781.3,4.607,4.607,0,0,0-.781,1q-0.091.15-.218,0.346l-0.246.38c-0.068-.288-0.137-0.582-0.212-0.885-0.459-1.847-2.494-.984-2.941-0.8-0.482.2-.353,0.647-0.094,0.529a0.869,0.869,0,0,1,1.281.585c0.217,0.751.377,1.436,0.527,2.038a5.688,5.688,0,0,1-.362.467,2.69,2.69,0,0,1-.264.271q-0.221-.08-0.471-0.147a2.029,2.029,0,0,0-.522-0.066,1.079,1.079,0,0,0-.768.3A1.058,1.058,0,0,0,9,15.131a0.82,0.82,0,0,0,.832.852,1.134,1.134,0,0,0,.787-0.3,5.11,5.11,0,0,0,.776-0.993q0.141-.219.215-0.34c0.046-.076.122-0.194,0.223-0.346a2.786,2.786,0,0,0,.918,1.726,2.582,2.582,0,0,0,2.376-.185c0.317-.181.212-0.565,0-0.494A0.807,0.807,0,0,1,14.176,15a5.159,5.159,0,0,1-.913-2.446l0,0Q13.487,12.24,13.663,12.027Z"></path> </svg>'
        };

        // this.quill.updateContents([{ insert: { formula: '\\sqrt{2399+39}' }}]);

        const autoLinks = document.getElementsByClassName('ql-autoLink');
        if (autoLinks) {
            [].slice.call(autoLinks).forEach((emojiBtn) => {
                emojiBtn.innerHTML = this.DEFAULTS.buttonIcon;
            });
        }

        this.quill = quill;

        this.toolbar = quill.getModule('toolbar');

        this.quill.getModule('toolbar').addHandler('autoLink', () => {

            this.checkMathsDialogOpen();
        });

    }

    public checkPalatteExist() {
        const quill = this.quill;
        this.quill.on('text-change', function (delta, oldDelta, source) {
            if (source === 'user') {
                console.log('update');
            }
        });

    }


    checkMathsDialogOpen() {
        // this.bottomSheet.open(BottomSheetOverviewExampleSheet);
        const quill = this.quill;
        const elementExists = document.getElementById('math-palette');
        if (elementExists) {
            const range = quill.getSelection();
            this.closeMaths(quill, range, event);
            elementExists.remove();

        } else {
            this.showMathsPalatte(quill);
        }
    }

    showMathsPalatte(quill) {
        // alert('my 95');
        let buttons;
        console.log('i am in  95');
        const elementMathArea = document.createElement('div');
        const toolbarContainer = document.querySelector('.ql-toolbar');
        const range = quill.getSelection();
        console.log('range', range);
        const atSignBounds = quill.getBounds(range.index);

        quill.container.appendChild(elementMathArea);
        const paletteMaxPos = atSignBounds.left + 400; // palette max width is 400
        elementMathArea.id = 'math-palette';
        console.log('master> ', atSignBounds);
        elementMathArea.style.top = atSignBounds.top - 10 + 'px';
        console.log('top>', elementMathArea.style.top);
        if (paletteMaxPos > quill.container.offsetWidth) {
            elementMathArea.style.left = (atSignBounds.left - 400) + 'px';
        } else {
            elementMathArea.style.left = atSignBounds.left + 'px';
        }

        const toolbar = document.createElement('div');
        toolbar.id = 'toolbar';
        elementMathArea.appendChild(toolbar);

        // panel
        const panel = document.createElement('div');
        panel.id = 'panel';
        elementMathArea.appendChild(panel);

        const tabElementHolder = document.createElement('div');
        toolbar.appendChild(tabElementHolder);

        // const closeDiv = document.createElement('div');
        // closeDiv.id = 'emoji-close-div-c';
        // closeDiv.innerText = 'X';
        // closeDiv.className = 'ql-close';
        // closeDiv.addEventListener('click', this.closeMaths.bind(event, quill, range), false);
        // tabElementHolder.appendChild(closeDiv);

        buttons = [
            this.buildRegularButton('1'),
            this.buildRegularButton('2'),
            this.buildRegularButton('3'),

            this.buildRegularButton('4'),
            this.buildRegularButton('5'),
            this.buildRegularButton('6'),

            this.buildRegularButton('7'),
            this.buildRegularButton('8'),
            this.buildRegularButton('9'),

            this.buildRegularButton('0'),
            this.buildRegularButton('.'),
            this.buildRegularButton('='),
            this.buildRegularButton('+'),

            this.buildRegularButton('-'),
            this.buildRegularButton('*'),
            this.buildRegularButton('/'),

            this.buildRegularButton('a'),
            this.buildRegularButton('b'),
            this.buildRegularButton('c'),

            this.buildRegularButton('x'),
            this.buildRegularButton('y'),
            this.buildRegularButton('z'),
            this.buildRegularButton('sqrt'),
            this.buildRegularButton('pm', '+-'),
            this.buildRegularButton('theta'),
            this.buildOperationalButton('Backspace', 'backspace'),
        ];
        const mathquill = document.createElement('div');
        mathquill.id = 'mathquill'; // set the CSS class
        tabElementHolder.appendChild(mathquill);

        const mathsQuill = document.getElementById('mathquill');
        const substitueId = document.createElement('span');
        substitueId.id = 'substitue-id'; // set the CSS class
        substitueId.className = 'mq-root-block';
        mathsQuill.appendChild(substitueId);

        const mKeyBoard = document.getElementById('maths-keyboard');
        if (mKeyBoard !== null) {
            mKeyBoard.parentNode.removeChild(mKeyBoard);
        }

        const mathsKeyboard = document.createElement('div');
        mathsKeyboard.id = 'maths-keyboard'; // set the CSS class

        const qlToolbar = document.getElementsByClassName('ql-toolbar');

        // if (mKeyBoard === null) {
        qlToolbar[0].appendChild(mathsKeyboard);
        // }

        console.log(mathsKeyboard.childNodes);
        // tabElementHolder.appendChild(mathsKeyboard);

        const divx = document.getElementById('maths-keyboard');
        if (divx) {
            divx.innerHTML = '';
        }

        let div;
        buttons.forEach((button, index) => {
            if ((index % 10) === 0 || ((buttons.length - 1) === index)) {
                // mathsKeyboard = document.getElementById('maths-keyboard');

                if (div && mathsKeyboard) {
                    mathsKeyboard.appendChild(div);
                }
                div = document.createElement('div');

                //
            }
            const btn = document.createElement('BUTTON');
            btn.innerHTML = button.displayContent;

            btn.setAttribute('class', 'key');
            btn.addEventListener('click',
                this.onClickLink.bind(event, button.displayContent, button.action, button.content)
                , true);


            if (mathsKeyboard) {
                mathsKeyboard.appendChild(btn);
            }
            div.appendChild(btn);
        });
        const MQ = (window as any).MathQuill.getInterface(2);
        const mathquilljs = MQ.MathField(document.getElementById('mathquill'));
        mathquilljs.focus();

    }

    onClickLink(displayContent, action, content, event) {

        const MQ = (window as any).MathQuill.getInterface(2);
        const mathquill = MQ.MathField(document.getElementById('mathquill'));
        console.log('maths', mathquill);
        if (mathquill) {
            if (action === 'write') {
                mathquill.cmd(content);
            } else if (action === 'cmd') {
                mathquill.cmd(content);
            } else {
                mathquill.keystroke(content);
            }
            console.log('maths quill', mathquill);
        }
    }

    buildRegularButton(content, displayContent = '') {
        return {
            displayContent: displayContent ? displayContent : content,
            content: content,
            type: 'REGULAR',
            action: 'cmd'
        };
    }

    buildOperationalButton(content, iconId, iconType = '') {
        return {
            content: content,
            displayContent: iconId,
            action: 'keystroke',
            iconId: iconId,
            iconType: iconType ? iconType : 'material',
            type: 'OPERATIONAL'
        };
    }


    closeMaths(quill, range, event) {
        let rangeIndex = range.index;
        rangeIndex = (rangeIndex) ? rangeIndex : 1;
        console.log('inded', rangeIndex);
        const MQ = (window as any).MathQuill.getInterface(2);
        const mathquill = MQ.MathField(document.getElementById('mathquill'));
        const latesx = ' ' +  mathquill.latex() + ' ';
        console.log('console.log latest synz', );
        console.log(latesx);
        // let updateContent = [];

        // updateContent = [...];

        // { retain: rangeIndex }, 

        quill.updateContents([{ retain: rangeIndex }, { insert: { formula: latesx } }]);
        // quill.setContents(opt);
        const delta = quill.getContents();
        console.log(delta);
        quill.focus();
        const eleMathPlate = document.getElementById('math-palette');
        if (eleMathPlate) { eleMathPlate.remove(); }

    }


    // registerPasteListener() {
    //     console.log('reigster paste lister');
    // }
    registerTypeListener() {
        //     // this.toolbar.addHandler('quillAutoLink', this.checkMathsDialogOpen);

        //     // this.quill.getModule('toolbar').addHandler('autoLink', () => {
        //     //     alert('tester jite');
        //     //     this.checkMathsDialogOpen();
        //     //   });
        this.quill.on('text-change', (delta) => {
            console.log('test changed');
        });
        console.log('reigster type lister');
    }
    checkTextForUrl() {
        console.log('reigster type lister');
    }
    textToUrl(index, text, url) {

    }
}
