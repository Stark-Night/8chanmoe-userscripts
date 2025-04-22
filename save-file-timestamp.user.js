// ==UserScript==
// @name        Download File Under Timestamp Name on 8chanmoe
// @namespace   pcgia
// @description Adds a button to download a file and gives it a timestamp name, instead of the original name or the hash
// @match       https://8chan.moe/*/res/*
// @match       https://8chan.se/*/res/*
// @grant       none
// @run-at      document-end
// @author      Starknight
// @version     2.0.0
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

const addDownloadButton = function (cell) {
    const hideFileButton = cell.querySelector('span.hideFileButton');
    if (!hideFileButton) {
        console.error('I can\'t find the hide button, ignoring this cell.');
        return false;
    }

    const originalNameLink = cell.querySelector('a.originalNameLink');
    if (!originalNameLink || !originalNameLink.href || 0 === originalNameLink.href.length) {
        console.error('I can\'t grasp the original file name, ignoring this cell.');
        return false;
    }

    const serverHref = originalNameLink.href;
    const hrefSplit = serverHref.split('.');
    if (2 > hrefSplit.length) {
        console.error('The file name is quite unexpected, ignoring this cell.');
        return false;
    }

    const serverExt = '.' + hrefSplit.pop();
    const timeName = (window.performance.timing.navigationStart +
                      window.performance.now()) / 0.001;

    const downloadButton = document.createElement('a');
    downloadButton.href = originalNameLink.href;
    downloadButton.download = `${timeName}` + serverExt;
    downloadButton.dataset.fileExt = serverExt;
    downloadButton.classList.add('nameLink', 'coloredIcon', 'pcgiaTimestampDownloadButton');
    downloadButton.title = 'Download file';

    hideFileButton.after(downloadButton);
    return true;
};

const uploadCells = Array.from(document.querySelectorAll('figure.uploadCell'));
for (let cell of uploadCells) {
    addDownloadButton(cell);
}

const threadList = document.getElementById('threadList');
if (!threadList) {
    console.error('Cannot determine thread list, will not auto-update.');
} else {
    const allPosts = threadList.querySelector('.divPosts');
    if (!allPosts) {
        console.error('Cannot determine where posts go, will not auto-update');
    } else {
        const mutationObserver = new MutationObserver((changes, self) => {
            for (change of changes) {
                for (node of change.addedNodes) {
                    const cells = Array.from(node.querySelectorAll('figure.uploadCell'));
                    for (cell of cells) {
                        addDownloadButton(cell);
                    }
                }
            }
        });

        mutationObserver.observe(allPosts, { attributes: false, childList: true, subtree: false });
    }
}

const thisCss = `.uploadCell > details .pcgiaTimestampDownloadButton::after {
     content: '\\e04E';
}

.uploadCell > details .pcgiaTimestampDownloadButton {
     display: inline-block;
     margin-left: 0.125em;
}`;
const thisStyle = document.createElement('style');
thisStyle.innerText = thisCss;
document.head.appendChild(thisStyle);
