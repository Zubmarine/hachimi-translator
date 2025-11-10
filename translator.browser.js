(function (global) {
    'use strict';

    const HACHIMI = '哈基米阿西嘎曼波';

    function str2oct(s) {
        let r = '';
        let max = 0;
        for (const ch of s) {
            const cp = ch.codePointAt(0);
            if (cp > max) max = cp;
        }
        const len = max.toString(8).length;
        for (const ch of s) {
            let o = ch.codePointAt(0).toString(8);
            if (o.length < len) o = '0'.repeat(len - o.length) + o;
            r += o;
        }
        return { code: r, len };
    }

    function oct2str(o, len) {
        let r = '';
        for (let i = 0; i < o.length; i += len) {
            const part = o.slice(i, i + len);
            const cp = parseInt(part, 8);
            r += String.fromCodePoint(cp);
        }
        return r;
    }

    function encode(s) {
        const { code, len } = str2oct(s);
        let cipher = HACHIMI.charAt(len);
        for (const c of code) {
            cipher += HACHIMI.charAt(parseInt(c, 10));
        }
        return cipher;
    }

    function decode(s) {
        const len = HACHIMI.indexOf(s.charAt(0));
        const digits = [];
        for (let i = 1; i < s.length; i++) {
            digits.push(String(HACHIMI.indexOf(s.charAt(i))));
        }
        return oct2str(digits.join(''), len);
    }

    // 验证密文格式是否符合要求，返回 { ok: boolean, message?: string }
    function validateCipher(s) {
        if (!s || s.length === 0) return { ok: false, message: '密文为空' };
        // 所有字符必须属于 HACHIMI
        for (const ch of s) {
            if (HACHIMI.indexOf(ch) === -1) return { ok: false, message: '密文包含非法字符' };
        }
        const firstIndex = HACHIMI.indexOf(s.charAt(0));
        if (firstIndex <= 0) return { ok: false, message: '密文不合法' };
        const len = firstIndex;
        const digits = [];
        for (let i = 1; i < s.length; i++) {
            const idx = HACHIMI.indexOf(s.charAt(i));
            if (idx === -1) return { ok: false, message: '密文包含非法字符' };
            digits.push(String(idx));
        }
        const digitsStr = digits.join('');
        if (digitsStr.length % len !== 0) return { ok: false, message: `密文不合法` };
        return { ok: true };
    }

    global.HachimiTranslator = {
        HACHIMI,
        str2oct,
        oct2str,
        encode,
        decode,
        validateCipher,
    };

})(window);
