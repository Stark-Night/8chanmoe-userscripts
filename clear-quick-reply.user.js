// ==UserScript==
// @name        Make Sure Quick Reply is Cleared on 8chanmoe
// @namespace   pcgia
// @description Make sure quick reply is cleared on 8chanmoe
// @match       https://8chan.moe/*/res/*
// @match       https://8chan.se/*/res/*
// @grant       none
// @run-at      document-end
// @author      Starknight
// @version     1.0.0
// ==/UserScript==

// Copyright 2025 Starknights
//
// Permission is hereby granted, free of charge, to any person
// obtaining a copy of this software and associated documentation
// files (the “Software”), to deal in the Software without
// restriction, including without limitation the rights to use, copy,
// modify, merge, publish, distribute, sublicense, and/or sell copies
// of the Software, and to permit persons to whom the Software is
// furnished to do so.
//
// THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND,
// EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
// NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS
// BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN
// ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
// CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.

const clearQuickReply = function (_event) {
    const textarea = document.querySelector('#quick-reply table > tbody tr td > textarea');
    if (!textarea) {
        console.error('I can\'t find the Quick Reply text area... :(');
        return;
    }

    const visible = Array.from(document.querySelectorAll('.postCell'))
          .filter((e) => (e.getBoundingClientRect().y > 0));
    const offsets = visible.map((e) => (e.offsetTop));
    const last = (offsets.length > 0) ? offsets[0] : document.body.scrollHeight;

    location.hash = '';
    window.scrollTo(0, last);
    textarea.value = '';
};

const qreplyCloseButton = document.querySelector('#quick-reply table > tbody th > a.close-btn');
if (qreplyCloseButton) {
    qreplyCloseButton.addEventListener('click', clearQuickReply);
} else {
    console.error('I can\'t find the Quick Reply close button... :(');
}
