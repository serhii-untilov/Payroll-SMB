import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default defineConfig(({ command, mode }) => {
    // Load env file based on `mode` in the current working directory.
    // Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
    const env = loadEnv(mode, process.cwd(), '');
    return {
        plugins: [react()],
        base: env.VITE_APP_URL,
        server: {
            strictPort: true,
            open: mode === 'development',
            proxy: {
                '/api': {
                    target: mode === 'development' ? env.VITE_API_URL : env.VITE_APP_URL, // local NestJS application
                    changeOrigin: true,
                },
            },
        },
    };
});
