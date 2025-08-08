import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  // Base path configuration for different deployment targets
  base: process.env.DEPLOY_TARGET === 'cpanel' ? '/' : 
        process.env.NODE_ENV === 'production' ? '/ethiopian-opportunities-hub/' : '/',
  
  build: {
    // Optimize for deployment
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    minify: 'esbuild',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          supabase: ['@supabase/supabase-js'],
          ui: ['@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu'],
          ml: ['@huggingface/transformers'] // Separate ML libraries
        }
      }
    },
    // ES2020 for BigInt support (required by @huggingface/transformers)
    target: 'es2020'
  },
  
  // Preview server configuration for testing
  preview: {
    port: 4173,
    host: true
  }
}));
