// renderer/+config.ts
const config_default = {
  clientRouting: true,
  prefetchStaticAssets: 'viewport',
  passToClient: [
    'pageProps',
    /* 'urlPathname', */
    'routeParams',
  ],
  meta: {
    title: {
      // Make the value of `title` available on both the server- and client-side
      env: { server: true, client: true },
    },
    description: {
      // Make the value of `description` available only on the server-side
      env: { server: true },
    },
  },
}
export { config_default as default }
// # sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiK2NvbmZpZy50cyJdLAogICJzb3VyY2VzQ29udGVudCI6IFsiLy8gU2VlIGh0dHBzOi8vdmlrZS5kZXYvZGF0YS1mZXRjaGluZ1xuZXhwb3J0IGRlZmF1bHQge1xuICBjbGllbnRSb3V0aW5nOiB0cnVlLFxuICBwcmVmZXRjaFN0YXRpY0Fzc2V0czogJ3ZpZXdwb3J0JyxcbiAgcGFzc1RvQ2xpZW50OiBbJ3BhZ2VQcm9wcycsIC8qICd1cmxQYXRobmFtZScsICovICdyb3V0ZVBhcmFtcyddLFxuICBtZXRhOiB7XG4gICAgdGl0bGU6IHtcbiAgICAgIC8vIE1ha2UgdGhlIHZhbHVlIG9mIGB0aXRsZWAgYXZhaWxhYmxlIG9uIGJvdGggdGhlIHNlcnZlci0gYW5kIGNsaWVudC1zaWRlXG4gICAgICBlbnY6IHsgc2VydmVyOiB0cnVlLCBjbGllbnQ6IHRydWUgfSxcbiAgICB9LFxuICAgIGRlc2NyaXB0aW9uOiB7XG4gICAgICAvLyBNYWtlIHRoZSB2YWx1ZSBvZiBgZGVzY3JpcHRpb25gIGF2YWlsYWJsZSBvbmx5IG9uIHRoZSBzZXJ2ZXItc2lkZVxuICAgICAgZW52OiB7IHNlcnZlcjogdHJ1ZSB9LFxuICAgIH0sXG4gIH0sXG59XG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQ0EsSUFBTyxpQkFBUTtBQUFBLEVBQ2IsZUFBZTtBQUFBLEVBQ2Ysc0JBQXNCO0FBQUEsRUFDdEIsY0FBYztBQUFBLElBQUM7QUFBQTtBQUFBLElBQWtDO0FBQUEsRUFBYTtBQUFBLEVBQzlELE1BQU07QUFBQSxJQUNKLE9BQU87QUFBQTtBQUFBLE1BRUwsS0FBSyxFQUFFLFFBQVEsTUFBTSxRQUFRLEtBQUs7QUFBQSxJQUNwQztBQUFBLElBQ0EsYUFBYTtBQUFBO0FBQUEsTUFFWCxLQUFLLEVBQUUsUUFBUSxLQUFLO0FBQUEsSUFDdEI7QUFBQSxFQUNGO0FBQ0Y7IiwKICAibmFtZXMiOiBbXQp9Cg==
