// ==UserScript==
// @name        Mark Post As (You) on 8chanmoe
// @namespace   pcgia
// @description Mark a post as (You) on 8chanmoe
// @match       https://8chan.moe/*/res/*
// @match       https://8chan.se/*/res/*
// @grant       none
// @run-at      document-end
// @author      Starknight
// @version     2.1.1
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

const addYouButton = function (postCell) {
    const extraMenuButton = postCell.querySelector('.innerPost label.extraMenuButton');
    if (!extraMenuButton) {
        console.error('I can\'t find this post\'s menu buttons :(');
        return false;
    }

    const youButton = document.createElement('label');
    youButton.classList.add('pcgiaYouButton', 'glowOnHover', 'coloredIcon');
    youButton.title = 'Mark this post as (You)';

    const markPostAsYou = function (event) {
        const postCell = event.target.parentNode.parentNode.parentNode;
        const postId = parseInt(postCell.id);
        const boardName = document.getElementById('boardIdentifier').value;

        const key = boardName + '-yous';
        let allYous = JSON.parse(localStorage.getItem(key)) || [];
        allYous.push(postId);
        allYous.sort();
        allYous = allYous.filter((e, i, a) => a.indexOf(e) === i);

        localStorage.setItem(key, JSON.stringify(allYous));
        if (posting) { // global variable from Aleph frontend
            posting.yous.push(postId);
        }

        const quoteLinks = Array.from(document.querySelectorAll('a.quoteLink'));
        for (quote of quoteLinks) {
            if ('>>' + postId === quote.innerText) {
                quote.classList.add('you');

                const span = document.createElement('span');
                span.classList.add('qmark-you');
                span.innerHTML = '(You)';

                quote.append(span);

                quote.parentNode.parentNode.classList.add('quotesYou');
            }
        }

        const postName = postCell.querySelector('.linkName');
        if (postName) {
            postName.classList.add('youName');
        }

        const innerPost = postCell.querySelector('.innerPost');
        innerPost.classList.add('yourPost');
    };
    youButton.addEventListener('click', markPostAsYou);

    extraMenuButton.after(youButton);
    return true;
};

const postCells = Array.from(document.querySelectorAll('div.postCell'));
for (let postCell of postCells) {
    addYouButton(postCell);
}

const allPosts = document.querySelector('#threadList .divPosts');
if (allPosts) {
    const mutationObserver = new MutationObserver((changes, self) => {
        for (change of changes) {
            for (node of change.addedNodes) {
                addYouButton(node);
            }
        }
    });
    mutationObserver.observe(allPosts, { attributes: false, childList: true, subtree: false });
}

const thisCss = `.innerPost label.pcgiaYouButton::before {
     content: '\\e0A5';
}`
const thisStyle = document.createElement('style');
thisStyle.innerText = thisCss;
document.head.appendChild(thisStyle);
