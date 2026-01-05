function waitForElement(selector, timeout=6000) {
    return new Promise( (resolve, reject) => {
        const el = document.querySelector(selector);
        if (el)
            return resolve(el);

        const observer = new MutationObserver( () => {
            const found = document.querySelector(selector);
            if (found) {
                observer.disconnect();
                resolve(found);
            }
        }
        );

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });

        setTimeout( () => {
            observer.disconnect();
            reject(new Error(`Timeout: ${selector}`));
        }
        , timeout);
    }
    );
}

// 封装“执行1-3步 + 最终点击指定子项”的通用流程
async function performSaveAsClick(targetChildIndex) {
    console.log(`▶ 开始执行流程：点击模态框第 ${targetChildIndex} 项`);

    // 第1步：点击 file-menu（确保每次都重新打开）
    const menuBtn = document.querySelector("body > header > div.file-menu");
    if (!menuBtn)
        throw new Error("❌ file-menu 按钮未找到");
    menuBtn.click();

    // 第2步：等待并点击主菜单第4项
    const mainItem4 = await waitForElement("body > div.main-menu > ul > li:nth-child(4)");
    mainItem4.click();

    // 第3步：等待 save-as 面板激活，并点击第3项
    const saveAsItem3 = await waitForElement("body > div.main-menu > div > div.tab-pane.save-as.active > ul > li:nth-child(3)");
    saveAsItem3.click();

    // 第4步：等待模态框出现，点击指定子项（如第1项或第7项）
    const targetItem = await waitForElement(`body > div.modal.fade.ng-isolate-scope.in > div > div > div.modal-body.clearfix.ng-scope > ul > li:nth-child(${targetChildIndex}) > span`);
    targetItem.click();

    console.log(`✅ 成功点击第 ${targetChildIndex} 项`);
}

// 主执行：先点第1项，再点第7项（各自独立流程）
(async () => {
    try {
        await performSaveAsClick(1);
        // 第一次：点第1项
        await new Promise(r => setTimeout(r, 1000));
        // 可选：稍作间隔，避免冲突
        await performSaveAsClick(7);
        // 第二次：点第7项
        console.log("🎉 所有操作完成！");
    } catch (error) {
        console.error("💥 流程中断:", error.message || error);
    }
}
)();
