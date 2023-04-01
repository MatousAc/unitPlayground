import adapter from '@sveltejs/adapter-cloudflare'
import { vitePreprocess } from '@sveltejs/kit/vite'

export default {
  kit: {
    adapter: adapter({
      // See below for an explanation of these options
      routes: {
        include: ['/*'],
        exclude: ['<all>']
      }
    }),
    alias: {
      // this will match a directory and its contents
      // (`my-directory/x` resolves to `path/to/my-directory/x`)
      'lib': './src/lib',
      'css': './src/css',
      'components': './src/components',
      '$': './src'
    }
  },
  preprocess: vitePreprocess()
}