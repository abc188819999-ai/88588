export class RealtimeClient extends EventTarget {
  constructor(bridge) {
    super();
    this.bridge = bridge;
    this.source = null;
    this.ws = null;
    this.retryTimer = 0;
    this.closed = false;
  }
  connect() {
    this.closed = false;
    if (this.bridge.mode === 'DEMO') { if (this.bridge.localDemo) return; return this.connectSSE(`/api/events?sessionId=${encodeURIComponent(this.bridge.sessionId)}`); }
    const cfg = this.bridge.platform;
    if (!cfg.realtimeUrl) return;
    if ((cfg.realtimeType || 'ws') === 'sse') this.connectSSE(cfg.realtimeUrl);
    else this.connectWS(cfg.realtimeUrl);
  }
  connectSSE(url) {
    this.disconnectTransport();
    const source = new EventSource(url);
    source.onopen = () => this.dispatchEvent(new Event('open'));
    source.onmessage = e => { try { this.dispatchEvent(new CustomEvent('message',{detail:JSON.parse(e.data)})); } catch {} };
    source.onerror = () => { this.dispatchEvent(new Event('error')); if (!this.closed) this.scheduleReconnect(); };
    this.source = source;
  }
  connectWS(url) {
    this.disconnectTransport();
    const ws = new WebSocket(url);
    ws.onopen = () => this.dispatchEvent(new Event('open'));
    ws.onmessage = e => { try { this.dispatchEvent(new CustomEvent('message',{detail:JSON.parse(e.data)})); } catch {} };
    ws.onclose = () => { this.dispatchEvent(new Event('error')); if (!this.closed) this.scheduleReconnect(); };
    this.ws = ws;
  }
  scheduleReconnect() {
    clearTimeout(this.retryTimer);
    this.retryTimer = setTimeout(() => this.connect(), 1800);
  }
  disconnectTransport() {
    if (this.source) this.source.close();
    if (this.ws) this.ws.close();
    this.source = null; this.ws = null;
  }
  close() { this.closed = true; clearTimeout(this.retryTimer); this.disconnectTransport(); }
}
