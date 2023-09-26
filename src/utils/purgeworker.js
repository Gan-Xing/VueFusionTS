// purgeWorker.js
self.addEventListener('message', async (e) => {
    try {
        const { htmlContent, cssFiles } = e.data;
        
        // 您可能需要在这里引入 PurgeCSS，这取决于您的项目结构和打包工具。
        const PurgeCSS = require('purgecss').PurgeCSS;
        
        const purgeCSSResult = await new PurgeCSS().purge({
            content: [{ raw: htmlContent, extension: 'html' }],
            css: cssFiles
        });
        
        self.postMessage({
            status: 'success',
            data: purgeCSSResult
        });
    } catch (error) {
        self.postMessage({
            status: 'error',
            error: error.message
        });
    }
});
