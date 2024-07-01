import fs from 'node:fs'
import path from 'node:path'
import { type Plugin, defineConfig } from 'vite'
import { fileURLToPath, URL } from 'node:url'
import vue from '@vitejs/plugin-vue'
import { execaSync } from 'execa'

function toPath(path: string) {
  return fileURLToPath(new URL(path, import.meta.url))
}

const commit = execaSync('git', ['rev-parse', '--short=7', 'HEAD']).stdout

export default defineConfig({
  plugins: [
    vue({
      script: {
        fs: {
          fileExists: fs.existsSync,
          readFile: file => fs.readFileSync(file, 'utf-8'),
        },
      },
    }),
    copyDdlazyUiPlugin(),
  ],
  define: {
    __COMMIT__: JSON.stringify(commit),
    __VUE_PROD_DEVTOOLS__: JSON.stringify(true),
  },
  optimizeDeps: {
    exclude: ['@vue/repl'],
  },
})

function copyDdlazyUiPlugin(): Plugin {
  return {
    name: 'copy-varlet-dependencies',

    buildStart() {
      fs.copyFileSync(toPath('../ddlazy-ui-plus/es/ddlazy-ui-plus.esm.js'), toPath('./public/ddlazy-ui-plus.esm.js'))
      fs.copyFileSync(toPath('../ddlazy-ui-plus/es/style.css'), toPath('./public/ddlazy-ui-plus.css'))
    },
  }
}
