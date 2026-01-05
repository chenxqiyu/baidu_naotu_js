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
            // 已存在，跳过
        }
        if (currentText.trim() === hyperlink.trim()) {
            return;
            // 已存在，跳过
        }

        // 构造新文本：原内容 + 换行 + 链接
        const newText = currentText + expectedSuffix;

        // 更新文本
        minder.select(node, true);
        // silent select
        minder.execCommand('text', newText);
    });
}

// 调用
appendHyperlinkToText(window.minder);