import { defineConfig } from 'tsup';

export default defineConfig({
    name: 'primehooks',
    entry: ['src/index.ts'],
    format: ['esm'],
    minifyWhitespace: true,
    minifyIdentifiers: true,
    dts: true,
    clean: true,
    async onSuccess() {
        console.log('Build completed successfully!');
    },
});