import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import path from 'path-browserify'
import svgSprites from 'rollup-plugin-svg-sprites'
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'


import { viteMockServe } from 'vite-plugin-mock'

// export default ({ command }: ConfigEnv): UserConfigExport => {
//   return {
//     plugins: [
//       vue(),
//       viteMockServe({
//         // default
//         mockPath: 'mock',
//         localEnabled: command === 'serve',
//       }),
//     ],
//   }
// }

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        vueJsx(),
        vue(),
        viteMockServe({
            // default
            mockPath: 'mock',
            localEnabled: true,
        }),
        createSvgIconsPlugin({
            iconDirs: ['src/icons/svg2'],
            symbolId: 'icon-[name]',
            inject: 'body-first'
        })
    ],
    resolve: {
        extensions: ['.cjs', '.mjs', '.js', '.ts', '.jsx', '.tsx', '.json', '.vue'],
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url)),
            path: 'path-browserify'
        }
    }
})
