import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';

export default defineConfig(() => {
    return {
        build: {
            outDir: 'build',
        },
        plugins: [react()],
        resolve: {
            alias: {
                "@": path.resolve(__dirname, "./src"),
            },
        },
        server: {
            https: {
                key: fs.readFileSync('certs/localhost+1-key.pem'),
                cert: fs.readFileSync('certs/localhost+1.pem'),
            },
            host: 'localhost',
            port: 5174,
        },
    };
});