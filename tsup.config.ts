import { defineConfig } from 'tsup';

export default defineConfig({
    name: 'primehooks',
    entry: ['src/index.ts'],
    target: 'es2020',
    format: ['esm', 'cjs'],
    splitting: true,
    treeshake: true,
    dts: true,
    clean: true,
    minify: false,
    async onSuccess() {
        console.log('Build completed successfully!');
    },
});