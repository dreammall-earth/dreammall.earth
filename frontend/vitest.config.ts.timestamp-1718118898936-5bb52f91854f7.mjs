// vitest.config.ts
import { defineConfig, mergeConfig, configDefaults } from "file:///home/tulex/Entwicklung/Projekte/dreammall/dreammall.earth/frontend/node_modules/vitest/dist/config.js";

// vite.config.ts
import path from "path";
import vueI18n from "file:///home/tulex/Entwicklung/Projekte/dreammall/dreammall.earth/frontend/node_modules/@intlify/unplugin-vue-i18n/lib/vite.mjs";
import vue from "file:///home/tulex/Entwicklung/Projekte/dreammall/dreammall.earth/frontend/node_modules/@vitejs/plugin-vue/dist/index.mjs";
import vike from "file:///home/tulex/Entwicklung/Projekte/dreammall/dreammall.earth/frontend/node_modules/vike/dist/esm/node/plugin/index.js";
import { checker } from "file:///home/tulex/Entwicklung/Projekte/dreammall/dreammall.earth/frontend/node_modules/vite-plugin-checker/dist/esm/main.js";
import viteCompression from "file:///home/tulex/Entwicklung/Projekte/dreammall/dreammall.earth/frontend/node_modules/vite-plugin-compression/dist/index.mjs";
import vuetify from "file:///home/tulex/Entwicklung/Projekte/dreammall/dreammall.earth/frontend/node_modules/vite-plugin-vuetify/dist/index.mjs";
import svgLoader from "file:///home/tulex/Entwicklung/Projekte/dreammall/dreammall.earth/frontend/node_modules/vite-svg-loader/index.js";
var __vite_injected_original_dirname = "/home/tulex/Entwicklung/Projekte/dreammall/dreammall.earth/frontend";
var isStorybook = () => ["storybook", "storybook:build"].includes(process.env.npm_lifecycle_event);
var config = {
  plugins: [
    vue(),
    svgLoader({
      defaultImport: "url",
      // Preserve default behavior to not break anything
      svgo: false
      // SVGO is disabled because it breaks the SVGs. It seems to be unmaintained.
    }),
    !isStorybook() && vike({ prerender: true }),
    // SSR only when storybook is not running
    vueI18n({
      ssr: true,
      include: path.resolve(__vite_injected_original_dirname, "./src/locales/**"),
      jitCompilation: false
    }),
    checker({
      typescript: true,
      vueTsc: true
    }),
    vuetify({ styles: { configFile: "./src/assets/scss/style.scss" } }),
    viteCompression({ filter: /\.*$/i })
  ],
  build: {
    outDir: "./build"
  },
  ssr: { noExternal: ["vuetify"] },
  resolve: {
    alias: {
      "#components": path.join(__vite_injected_original_dirname, "/src/components"),
      "#pages": path.join(__vite_injected_original_dirname, "/src/pages"),
      "#assets": path.join(__vite_injected_original_dirname, "/src/assets"),
      "#layouts": path.join(__vite_injected_original_dirname, "/src/layouts"),
      "#queries": path.join(__vite_injected_original_dirname, "/src/graphql/queries"),
      "#stores": path.join(__vite_injected_original_dirname, "/src/stores"),
      "#src": path.join(__vite_injected_original_dirname, "/src"),
      "#plugins": path.join(__vite_injected_original_dirname, "/renderer/plugins"),
      "#context": path.join(__vite_injected_original_dirname, "/renderer/context"),
      "#types": path.join(__vite_injected_original_dirname, "/types"),
      "#root": __vite_injected_original_dirname
    }
  },
  assetsInclude: isStorybook() ? ["/sb-preview/runtime.js"] : [],
  server: {
    hmr: {
      clientPort: isNaN(Number(process.env.PORT_HMR)) ? 24678 : Number(process.env.PORT_HMR),
      port: isNaN(Number(process.env.PORT_HMR)) ? 24678 : Number(process.env.PORT_HMR)
    }
  }
};
var vite_config_default = config;

// vitest.config.ts
var vitest_config_default = mergeConfig(
  vite_config_default,
  defineConfig({
    test: {
      css: true,
      globals: true,
      environment: "happy-dom",
      setupFiles: [
        "scripts/tests/mock.$t.ts",
        "scripts/tests/mock.vikePageContext.ts",
        "scripts/tests/mock.apolloClient.ts",
        "scripts/tests/mock.authService.ts",
        "scripts/tests/plugin.pinia.ts",
        "scripts/tests/plugin.i18n-vuetify.ts"
      ],
      coverage: {
        all: true,
        include: ["src/**/*.{js,jsx,ts,tsx,vue}"],
        exclude: [
          ...configDefaults.exclude,
          // storybook
          "**/*{.,-}stories.?(c|m)[jt]s?(x)",
          "src/stories/**/*"
        ],
        thresholds: {
          lines: 99,
          // functions: 20, // has problems see https://github.com/vitest-dev/vitest/issues/3607
          branches: 99,
          statements: 99
        }
      }
    }
  })
);
export {
  vitest_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZXN0LmNvbmZpZy50cyIsICJ2aXRlLmNvbmZpZy50cyJdLAogICJzb3VyY2VzQ29udGVudCI6IFsiY29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUgPSBcIi9ob21lL3R1bGV4L0VudHdpY2tsdW5nL1Byb2pla3RlL2RyZWFtbWFsbC9kcmVhbW1hbGwuZWFydGgvZnJvbnRlbmRcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIi9ob21lL3R1bGV4L0VudHdpY2tsdW5nL1Byb2pla3RlL2RyZWFtbWFsbC9kcmVhbW1hbGwuZWFydGgvZnJvbnRlbmQvdml0ZXN0LmNvbmZpZy50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vaG9tZS90dWxleC9FbnR3aWNrbHVuZy9Qcm9qZWt0ZS9kcmVhbW1hbGwvZHJlYW1tYWxsLmVhcnRoL2Zyb250ZW5kL3ZpdGVzdC5jb25maWcudHNcIjtpbXBvcnQgeyBkZWZpbmVDb25maWcsIG1lcmdlQ29uZmlnLCBjb25maWdEZWZhdWx0cyB9IGZyb20gJ3ZpdGVzdC9jb25maWcnXG5cbmltcG9ydCB2aXRlQ29uZmlnIGZyb20gJy4vdml0ZS5jb25maWcnXG5cbmV4cG9ydCBkZWZhdWx0IG1lcmdlQ29uZmlnKFxuICB2aXRlQ29uZmlnLFxuICBkZWZpbmVDb25maWcoe1xuICAgIHRlc3Q6IHtcbiAgICAgIGNzczogdHJ1ZSxcbiAgICAgIGdsb2JhbHM6IHRydWUsXG4gICAgICBlbnZpcm9ubWVudDogJ2hhcHB5LWRvbScsXG4gICAgICBzZXR1cEZpbGVzOiBbXG4gICAgICAgICdzY3JpcHRzL3Rlc3RzL21vY2suJHQudHMnLFxuICAgICAgICAnc2NyaXB0cy90ZXN0cy9tb2NrLnZpa2VQYWdlQ29udGV4dC50cycsXG4gICAgICAgICdzY3JpcHRzL3Rlc3RzL21vY2suYXBvbGxvQ2xpZW50LnRzJyxcbiAgICAgICAgJ3NjcmlwdHMvdGVzdHMvbW9jay5hdXRoU2VydmljZS50cycsXG4gICAgICAgICdzY3JpcHRzL3Rlc3RzL3BsdWdpbi5waW5pYS50cycsXG4gICAgICAgICdzY3JpcHRzL3Rlc3RzL3BsdWdpbi5pMThuLXZ1ZXRpZnkudHMnLFxuICAgICAgXSxcbiAgICAgIGNvdmVyYWdlOiB7XG4gICAgICAgIGFsbDogdHJ1ZSxcbiAgICAgICAgaW5jbHVkZTogWydzcmMvKiovKi57anMsanN4LHRzLHRzeCx2dWV9J10sXG4gICAgICAgIGV4Y2x1ZGU6IFtcbiAgICAgICAgICAuLi5jb25maWdEZWZhdWx0cy5leGNsdWRlLFxuICAgICAgICAgIC8vIHN0b3J5Ym9va1xuICAgICAgICAgICcqKi8qey4sLX1zdG9yaWVzLj8oY3xtKVtqdF1zPyh4KScsXG4gICAgICAgICAgJ3NyYy9zdG9yaWVzLyoqLyonLFxuICAgICAgICBdLFxuICAgICAgICB0aHJlc2hvbGRzOiB7XG4gICAgICAgICAgbGluZXM6IDk5LFxuICAgICAgICAgIC8vIGZ1bmN0aW9uczogMjAsIC8vIGhhcyBwcm9ibGVtcyBzZWUgaHR0cHM6Ly9naXRodWIuY29tL3ZpdGVzdC1kZXYvdml0ZXN0L2lzc3Vlcy8zNjA3XG4gICAgICAgICAgYnJhbmNoZXM6IDk5LFxuICAgICAgICAgIHN0YXRlbWVudHM6IDk5LFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9LFxuICB9KSxcbilcbiIsICJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiL2hvbWUvdHVsZXgvRW50d2lja2x1bmcvUHJvamVrdGUvZHJlYW1tYWxsL2RyZWFtbWFsbC5lYXJ0aC9mcm9udGVuZFwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiL2hvbWUvdHVsZXgvRW50d2lja2x1bmcvUHJvamVrdGUvZHJlYW1tYWxsL2RyZWFtbWFsbC5lYXJ0aC9mcm9udGVuZC92aXRlLmNvbmZpZy50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vaG9tZS90dWxleC9FbnR3aWNrbHVuZy9Qcm9qZWt0ZS9kcmVhbW1hbGwvZHJlYW1tYWxsLmVhcnRoL2Zyb250ZW5kL3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0IHBhdGggZnJvbSAncGF0aCdcblxuaW1wb3J0IHZ1ZUkxOG4gZnJvbSAnQGludGxpZnkvdW5wbHVnaW4tdnVlLWkxOG4vdml0ZSdcbmltcG9ydCB2dWUgZnJvbSAnQHZpdGVqcy9wbHVnaW4tdnVlJ1xuaW1wb3J0IHZpa2UgZnJvbSAndmlrZS9wbHVnaW4nXG5pbXBvcnQgeyBVc2VyQ29uZmlnIH0gZnJvbSAndml0ZSdcbmltcG9ydCB7IGNoZWNrZXIgfSBmcm9tICd2aXRlLXBsdWdpbi1jaGVja2VyJ1xuaW1wb3J0IHZpdGVDb21wcmVzc2lvbiBmcm9tICd2aXRlLXBsdWdpbi1jb21wcmVzc2lvbidcbmltcG9ydCB2dWV0aWZ5IGZyb20gJ3ZpdGUtcGx1Z2luLXZ1ZXRpZnknXG5pbXBvcnQgc3ZnTG9hZGVyIGZyb20gJ3ZpdGUtc3ZnLWxvYWRlcidcblxuY29uc3QgaXNTdG9yeWJvb2sgPSAoKSA9PlxuICBbJ3N0b3J5Ym9vaycsICdzdG9yeWJvb2s6YnVpbGQnXS5pbmNsdWRlcyhwcm9jZXNzLmVudi5ucG1fbGlmZWN5Y2xlX2V2ZW50IGFzIHN0cmluZylcblxuY29uc3QgY29uZmlnOiBVc2VyQ29uZmlnID0ge1xuICBwbHVnaW5zOiBbXG4gICAgdnVlKCksXG4gICAgc3ZnTG9hZGVyKHtcbiAgICAgIGRlZmF1bHRJbXBvcnQ6ICd1cmwnLCAvLyBQcmVzZXJ2ZSBkZWZhdWx0IGJlaGF2aW9yIHRvIG5vdCBicmVhayBhbnl0aGluZ1xuICAgICAgc3ZnbzogZmFsc2UsIC8vIFNWR08gaXMgZGlzYWJsZWQgYmVjYXVzZSBpdCBicmVha3MgdGhlIFNWR3MuIEl0IHNlZW1zIHRvIGJlIHVubWFpbnRhaW5lZC5cbiAgICB9KSxcbiAgICAhaXNTdG9yeWJvb2soKSAmJiB2aWtlKHsgcHJlcmVuZGVyOiB0cnVlIH0pLCAvLyBTU1Igb25seSB3aGVuIHN0b3J5Ym9vayBpcyBub3QgcnVubmluZ1xuICAgIHZ1ZUkxOG4oe1xuICAgICAgc3NyOiB0cnVlLFxuICAgICAgaW5jbHVkZTogcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgJy4vc3JjL2xvY2FsZXMvKionKSxcbiAgICAgIGppdENvbXBpbGF0aW9uOiBmYWxzZSxcbiAgICB9KSxcbiAgICBjaGVja2VyKHtcbiAgICAgIHR5cGVzY3JpcHQ6IHRydWUsXG4gICAgICB2dWVUc2M6IHRydWUsXG4gICAgfSksXG4gICAgdnVldGlmeSh7IHN0eWxlczogeyBjb25maWdGaWxlOiAnLi9zcmMvYXNzZXRzL3Njc3Mvc3R5bGUuc2NzcycgfSB9KSxcbiAgICB2aXRlQ29tcHJlc3Npb24oeyBmaWx0ZXI6IC9cXC4qJC9pIH0pLFxuICBdLFxuICBidWlsZDoge1xuICAgIG91dERpcjogJy4vYnVpbGQnLFxuICB9LFxuICBzc3I6IHsgbm9FeHRlcm5hbDogWyd2dWV0aWZ5J10gfSxcbiAgcmVzb2x2ZToge1xuICAgIGFsaWFzOiB7XG4gICAgICAnI2NvbXBvbmVudHMnOiBwYXRoLmpvaW4oX19kaXJuYW1lLCAnL3NyYy9jb21wb25lbnRzJyksXG4gICAgICAnI3BhZ2VzJzogcGF0aC5qb2luKF9fZGlybmFtZSwgJy9zcmMvcGFnZXMnKSxcbiAgICAgICcjYXNzZXRzJzogcGF0aC5qb2luKF9fZGlybmFtZSwgJy9zcmMvYXNzZXRzJyksXG4gICAgICAnI2xheW91dHMnOiBwYXRoLmpvaW4oX19kaXJuYW1lLCAnL3NyYy9sYXlvdXRzJyksXG4gICAgICAnI3F1ZXJpZXMnOiBwYXRoLmpvaW4oX19kaXJuYW1lLCAnL3NyYy9ncmFwaHFsL3F1ZXJpZXMnKSxcbiAgICAgICcjc3RvcmVzJzogcGF0aC5qb2luKF9fZGlybmFtZSwgJy9zcmMvc3RvcmVzJyksXG4gICAgICAnI3NyYyc6IHBhdGguam9pbihfX2Rpcm5hbWUsICcvc3JjJyksXG4gICAgICAnI3BsdWdpbnMnOiBwYXRoLmpvaW4oX19kaXJuYW1lLCAnL3JlbmRlcmVyL3BsdWdpbnMnKSxcbiAgICAgICcjY29udGV4dCc6IHBhdGguam9pbihfX2Rpcm5hbWUsICcvcmVuZGVyZXIvY29udGV4dCcpLFxuICAgICAgJyN0eXBlcyc6IHBhdGguam9pbihfX2Rpcm5hbWUsICcvdHlwZXMnKSxcbiAgICAgICcjcm9vdCc6IF9fZGlybmFtZSxcbiAgICB9LFxuICB9LFxuICBhc3NldHNJbmNsdWRlOiBpc1N0b3J5Ym9vaygpID8gWycvc2ItcHJldmlldy9ydW50aW1lLmpzJ10gOiBbXSxcbiAgc2VydmVyOiB7XG4gICAgaG1yOiB7XG4gICAgICBjbGllbnRQb3J0OiBpc05hTihOdW1iZXIocHJvY2Vzcy5lbnYuUE9SVF9ITVIpKSA/IDI0Njc4IDogTnVtYmVyKHByb2Nlc3MuZW52LlBPUlRfSE1SKSxcbiAgICAgIHBvcnQ6IGlzTmFOKE51bWJlcihwcm9jZXNzLmVudi5QT1JUX0hNUikpID8gMjQ2NzggOiBOdW1iZXIocHJvY2Vzcy5lbnYuUE9SVF9ITVIpLFxuICAgIH0sXG4gIH0sXG59XG5cbmV4cG9ydCBkZWZhdWx0IGNvbmZpZ1xuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUErWCxTQUFTLGNBQWMsYUFBYSxzQkFBc0I7OztBQ0E5RCxPQUFPLFVBQVU7QUFFNVksT0FBTyxhQUFhO0FBQ3BCLE9BQU8sU0FBUztBQUNoQixPQUFPLFVBQVU7QUFFakIsU0FBUyxlQUFlO0FBQ3hCLE9BQU8scUJBQXFCO0FBQzVCLE9BQU8sYUFBYTtBQUNwQixPQUFPLGVBQWU7QUFUdEIsSUFBTSxtQ0FBbUM7QUFXekMsSUFBTSxjQUFjLE1BQ2xCLENBQUMsYUFBYSxpQkFBaUIsRUFBRSxTQUFTLFFBQVEsSUFBSSxtQkFBNkI7QUFFckYsSUFBTSxTQUFxQjtBQUFBLEVBQ3pCLFNBQVM7QUFBQSxJQUNQLElBQUk7QUFBQSxJQUNKLFVBQVU7QUFBQSxNQUNSLGVBQWU7QUFBQTtBQUFBLE1BQ2YsTUFB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
