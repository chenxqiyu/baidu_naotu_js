// ==UserScript==
// @name         百度脑图自动导出
// @namespace    http://tampermonkey.net/
// @version      2026-01-15
// @description  try to take over the world!
// @author       You
// @match        https://naotu.baidu.com/file/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=baidu.com
// @grant        none
// ==/UserScript==

(function() {
    'use strict';


    function appendHyperlinkToText(minder) {
        const root = minder.getRoot();
        if (!root)
            return;

        root.traverse(function(node) {
            const data = node.getData();
            const hyperlink = data.hyperlink;
            const currentText = data.text || '';

            // 跳过无效链接
            if (!hyperlink || typeof hyperlink !== 'string' || hyperlink.trim() === '') {
                return;
            }

            // 检查是否已包含该链接（以换行 + 链接结尾）
            const expectedSuffix = '\n' + hyperlink;
            if (currentText.endsWith(expectedSuffix)) {
                return;
            }
            if (currentText.trim() === hyperlink.trim()) {
                return;
            }

            // 构造新文本：原内容 + 换行 + 链接
            const newText = currentText + expectedSuffix;

            // 更新文本
            minder.select(node, true);
            minder.execCommand('text', newText);
        });
    }

    // 等待元素的函数（保持不变）
    function waitForElement(selector, timeout = 6000) {
        return new Promise((resolve, reject) => {
            const el = document.querySelector(selector);
            if (el) return resolve(el);

            const observer = new MutationObserver(() => {
                const found = document.querySelector(selector);
                if (found) {
                    observer.disconnect();
                    resolve(found);
                }
            });

            observer.observe(document.body, { childList: true, subtree: true });

            setTimeout(() => {
                observer.disconnect();
                reject(new Error(`Timeout: ${selector}`));
            }, timeout);
        });
    }

    // performSaveAsClick 保持不变
    async function performSaveAsClick(targetChildIndex) {
        console.log(`▶ 开始执行流程：点击模态框第 ${targetChildIndex} 项`);

        const menuBtn = document.querySelector("body > header > div.file-menu");
        if (!menuBtn) throw new Error("❌ file-menu 按钮未找到");
        menuBtn.click();

        const mainItem4 = await waitForElement("body > div.main-menu > ul > li:nth-child(4)");
        mainItem4.click();

        const saveAsItem3 = await waitForElement("body > div.main-menu > div > div.tab-pane.save-as.active > ul > li:nth-child(3)");
        saveAsItem3.click();

        const targetItem = await waitForElement(`body > div.modal.fade.ng-isolate-scope.in > div > div > div.modal-body.clearfix.ng-scope > ul > li:nth-child(${targetChildIndex}) > span`);
        targetItem.click();

        console.log(`✅ 成功点击第 ${targetChildIndex} 项`);
    }

    window.onload=()=>{

        // 主流程：先执行 appendHyperlinkToText，再执行保存操作
        (async () => {
            try {
                // 第一步：处理超链接
                appendHyperlinkToText(window.minder);
                await new Promise(r => setTimeout(r, 2000)); // 50ms 足够大多数 UI 框架响应
                appendHyperlinkToText(window.minder);
                await new Promise(r => setTimeout(r, 2000)); // 50ms 足够大多数 UI 框架响应
                // 可选：等待一个 tick，确保 minder 的 execCommand 生效
                // 如果 minder 是同步更新的，这行可省略；但为保险起见建议保留
                await new Promise(r => setTimeout(r, 3000)); // 50ms 足够大多数 UI 框架响应

                // 第二步：执行保存操作
                await performSaveAsClick(1);
                await new Promise(r => setTimeout(r, 1000));
                await performSaveAsClick(7);

                console.log("🎉 所有操作完成！");
            } catch (error) {
                console.error("💥 流程中断:", error.message || error);
            }
        })();
    }



})();
