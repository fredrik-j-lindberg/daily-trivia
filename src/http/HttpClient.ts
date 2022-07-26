export default class HttpClient {
  baseUrl: string;

  constructor({ baseUrl }: {
    baseUrl: string
  }) {
    this.baseUrl = baseUrl;
  }

  async get(path: string, options: { params: Record<string, string> }) {
    const url = new URL(`${this.baseUrl}${path}`);
    url.search = new URLSearchParams(options.params).toString();
    try {
      const response = await fetch(url.toString());
      return await response.json();
    } catch (error) {
      console.error('Http request failed!', { error, url: url.toString() });
      return null;
    }
  }
}
