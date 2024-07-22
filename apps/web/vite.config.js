import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react-swc';
import { visualizer } from 'rollup-plugin-visualizer';
import path from 'path';
// https://vitejs.dev/config/
export default defineConfig(function (_a) {
    var mode = _a.mode;
    // Load env file based on `mode` in the current working directory.
    // Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
    var env = loadEnv(mode, process.cwd(), '');
    return {
        resolve: {
            alias: {
                '@': path.resolve(__dirname, './src'),
            },
        },
        plugins: [react(), visualizer()],
        base: env.VITE_APP_URL,
        server: {
            strictPort: true,
            // open: mode === 'development',
            proxy: {
                '/api': {
                    target: mode === 'development' ? env.VITE_API_URL : env.VITE_APP_URL, // local NestJS application
                    changeOrigin: true,
                },
            },
        },
    };
});
