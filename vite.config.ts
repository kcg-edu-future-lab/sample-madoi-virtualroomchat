import { defineConfig } from 'vite';
import react from "@vitejs/plugin-react-swc"

export default defineConfig({
  plugins: [react({ tsDecorators: true })],
  base: "./",
  build: {
    outDir: 'build', // ビルドの出力先ディレクトリ
    rollupOptions: {
      output: {
        manualChunks: undefined,
        inlineDynamicImports: true,
      },
    },
  },
  server: {
    open: true, // 自動でブラウザを開く
    port: 3000, // ここでポート番号を指定します
  },
});
