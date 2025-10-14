import { defineConfig } from 'tsup'

export default defineConfig([
    // ESM build
    {
        name: 'primehooks-esm',
        entry: ['src/index.ts'],
        target: 'es2020',
        format: ['esm'],
        splitting: true,
        treeshake: true,
        dts: true,
        sourcemap: true,
        clean: true,
        minify: true,
        outDir: 'dist/esm',
        async onSuccess() {
            console.log('✅ ESM build completed successfully!')
        },
    },
    // CJS build
    {
        name: 'primehooks-cjs',
        entry: ['src/index.ts'],
        target: 'es2020',
        format: ['cjs'],
        splitting: true,
        treeshake: true,
        dts: false,
        sourcemap: true,
        clean: false,
        minify: true,
        outDir: 'dist/cjs',
        async onSuccess() {
            console.log('✅ CJS build completed successfully!')
        },
    },
])
