// ==UserScript==
// @name        Ensure Wordle Spoilers are actually hidden
// @namespace   pcgia
// @description Warns if your Worlde spoiler is not hidden.
// @match       https://8chan.moe/*/res/*
// @match       https://8chan.st/*/res/*
// @version     1.0.0
// @grant       none
// @author      Starknight
// @run-at      document-end
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

const warnAboutSpoilers = (_e) =>{
    const bodies = [
        document.getElementById('fieldMessage'),
        document.getElementById('qrbody'),
    ];

    let hasWordle = false;
    for (const b of bodies) {
        const contents = b?.value || '';
        if (-1 !== contents.toLocaleLowerCase().indexOf('wordle spoiler')) {
            hasWordle = true;
        }
    }

    if (!hasWordle) {
        return;
    }

    const checks = [
        document.getElementById('checkboxSpoiler'),
        document.getElementById('qrcheckboxSpoiler'),
    ];
    const spoiled = checks.some((e) => (e.checked));

    if (spoiled) {
        return;
    }

    if (!window.confirm('You did not spoiler your Wordle! Submit anyway?')) {
        _e.preventDefault();
        return;
    }
};

const submitters = [
    document.getElementById('formButton'),
    document.getElementById('qrbutton'),
];

for (const b of submitters) {
    b.addEventListener('click', warnAboutSpoilers);
}
