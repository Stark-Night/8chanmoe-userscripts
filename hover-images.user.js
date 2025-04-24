// ==UserScript==
// @name        Image and video hovering on 8chanmoe
// @namespace   pcgia
// @description Display image preview following mouse cursor when hovering a file
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

const createHoverPreview = function (event) {
    const videoExt = ['webm', 'mp4'];
    // the audio list is not very reliable but what can you do
    const audioExt = ['ogg', 'opus', 'm4a', 'mp3'];

    const href = event.target.href;
    const hrefExt = href.split('.').pop();
    if (!hrefExt || 0 >= hrefExt.length || audioExt.includes(hrefExt)) {
        return;
    }

    let container = null;
    if (videoExt.includes(hrefExt)) {
        container = document.createElement('video');
        container.autoplay = true;
        container.loop = true;
    } else {
        container = document.createElement('img');
    }

    container.id = 'pcgiaImageHoverPreview';
    container.src = href;
    container.style.position = 'absolute';
    container.style.maxHeight = '100%';

    document.body.append(container);
};

const destroyHoverPreview = function (event) {
    const elem = document.getElementById('pcgiaImageHoverPreview');
    if (!elem) {
        return;
    }

    elem.remove();
};

const positionHoverPreview = function (event) {
    const elem = document.getElementById('pcgiaImageHoverPreview');
    if (!elem) {
        return;
    }

    const ex = event.pageX + 10;
    const ey = event.pageY - elem.offsetHeight / 2;

    elem.style.top = ey + 'px';
    elem.style.left = ex + 'px';
};

const addImageHover = function (imgLink) {
    imgLink.addEventListener('mouseenter', createHoverPreview);
    imgLink.addEventListener('mouseleave', destroyHoverPreview);
    imgLink.addEventListener('mousemove', positionHoverPreview);
};

const imgLinks = Array.from(document.querySelectorAll('a.imgLink'));
for (let imgLink of imgLinks) {
    addImageHover(imgLink);
}

const allPosts = document.querySelector('#threadList .divPosts');
if (allPosts) {
    const mutationObserver = new MutationObserver((changes, self) => {
        for (change of changes) {
            for (node of change.addedNodes) {
                const imgLinks = Array.from(node.querySelectorAll('a.imgLink'));
                for (let imgLink of imgLinks) {
                    addImageHover(imgLink);
                }
            }
        }
    });
    mutationObserver.observe(allPosts, { attributes: false, childList: true, subtree: false });
}
