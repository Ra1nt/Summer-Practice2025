/*
 * @Author: rain l0802_69@qq.com
 * @Date: 2025-09-03 14:30:32
 * @LastEditors: rain l0802_69@qq.com
 * @LastEditTime: 2025-09-04 08:18:06
 * @FilePath: /Summer-Practice2025/frontend/vite.config.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://10.249.13.72/',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
})
