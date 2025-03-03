// ==UserScript==
// @name         Bloqueador de Shorts - YTB
// @namespace    http://tampermonkey.net/
// @version      1.7
// @description  Bloqueador de videos Shorts e sugestões, verificando constantemente a URL e o conteudo dinamico
// @author       Renan
// @match        *://www.youtube.com/*
// @run-at       document-start
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    let lastURL = '';

    function blockShortsPage() {
        const currentURL = window.location.href;
        if (currentURL.includes('/shorts') && currentURL !== lastURL) {
            lastURL = currentURL;
            window.location.href = "https://www.youtube.com";
        }
    }

    function hideShortsSuggestions() {
        // modificar caso mude a classe
        const shortsSuggestions = document.querySelectorAll(
            'ytd-rich-shelf-renderer div#dismissible, ytd-reel-shelf-renderer, ytd-reel-item-renderer'
        );

        shortsSuggestions.forEach((element) => {
            element.style.display = 'none';
        });
    }

    function observeURLAndContent() {
        setInterval(() => {
            blockShortsPage();
        }, 500);

        const observer = new MutationObserver(hideShortsSuggestions);
        observer.observe(document.body, { childList: true, subtree: true });

        hideShortsSuggestions();
    }

    function init() {
        if (document.body) {
            observeURLAndContent();
        } else {
            const bodyObserver = new MutationObserver(() => {
                if (document.body) {
                    bodyObserver.disconnect();
                    observeURLAndContent();
                }
            });
            bodyObserver.observe(document.documentElement, { childList: true });
        }
    }

    init();
})();