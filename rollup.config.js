import svelte from 'rollup-plugin-svelte'
import commonjs from '@rollup/plugin-commonjs'
import resolve from '@rollup/plugin-node-resolve'
import replace from '@rollup/plugin-replace'
import dotenv from 'dotenv'
import { terser } from 'rollup-plugin-terser'
import { spawn } from 'child_process'
import livereload from 'rollup-plugin-livereload'
import rollupStartDevServer from 'rollup-plugin-dev-server'
import css from 'rollup-plugin-css-only'

const production = !process.env.ROLLUP_WATCH

const devServerConfig = {
  port: 3000,
  open: true,
  contentBase: 'public',
  historyApiFallback: true
}

export default {
  input: 'src/lib/index.js',
  output: {
    sourcemap: true,
    format: 'iife',
    name: 'app',
    file: 'public/build/bundle.js'
  },
  plugins: [
    svelte({
      dev: !production,
      css: (css) => {
        css.write('public/build/bundle.css')
      }
    }),
    resolve({
      browser: true,
      dedupe: ['svelte']
    }),
    commonjs(),
    replace({
      process: JSON.stringify({
        env: {
          isProd: production,
          ...dotenv.parsed
        }
      })
    }),
    production && terser(),
    !production &&
      rollupStartDevServer({
        ...devServerConfig,
        afterListen(server, { port }) {
          const lrServer = livereload.createServer({ port })
          lrServer.watch(['public'])
        }
      }),
    css({ output: 'bundle.css' })
  ],
  watch: {
    chokidar: true,
    clearScreen: false,
    buildDelay: 1000,
    exclude: ['node_modules/**'],
    include: ['src/**'],
    // Run vite server for non-js files
    async onRebuild(error, results) {
      if (error || results.some((result) => result.isAsset)) {
        return
      }

      await new Promise((resolve) => {
        spawn('npm', ['run', 'dev', '--', '--no-open'], {
          stdio: ['ignore', 'inherit', 'inherit']
        }).on('close', resolve)
      })
    }
  }
}
