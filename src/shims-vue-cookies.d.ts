declare module 'vue-cookies' {
  interface VueCookies {
    get(key: string): string | null
    set(key: string, value: string, expireTime: string): void
    remove(key: string): void
  }
}
