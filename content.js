// 検索結果から特定ドメインをブロックし、広告エリアを非表示にするChrome拡張のコンテンツスクリプト
// 1. 設定ファイル読み込み
let blockedDomains = [];

async function loadBlockedDomains() {
    try {
        const res = await fetch(chrome.runtime.getURL('domains.json'));
        if (!res.ok) throw new Error('domains.jsonの読み込みに失敗しました');
        blockedDomains = await res.json();
    } catch (e) {
        console.error('ドメインリストの読み込みエラー:', e);
    }
}

// 2. #taw（広告エリア）の非表示
function hideTaw() {
    const taw = document.getElementById('taw');
    if (taw) {
        taw.style.setProperty('display', 'none', 'important');
    }
}

// 3. 特定ドメインの検索結果ブロック
function hideBlockedResults() {
    if (!blockedDomains.length) return;
    const links = document.querySelectorAll('a[href]');
    links.forEach(link => {
        const url = link.href;
        if (blockedDomains.some(domain => url.includes(domain))) {
            // 検索結果ブロックの親要素を探す
            let block = link.closest('div[jscontroller], div[data-hveid], div.g');
            if (block) {
                block.style.setProperty('display', 'none', 'important');
            }
        }
    });
}

// 監視処理
function observeDom() {
    const observer = new MutationObserver(() => {
        hideTaw();
        hideBlockedResults();
    });
    observer.observe(document.body, { childList: true, subtree: true });
}

// 初期化
(async function init() {
    await loadBlockedDomains();
    hideTaw();
    hideBlockedResults();
    observeDom();
})();
