import { io, Socket } from "socket.io-client";

type Listener = (data: any) => void;

export class WebSocketService {
  private socket: Socket | null = null;
  private url: string;
  private loading: boolean = false;
  private connectFailed: boolean = false;
  // Events (e.g. GAME_JOIN) that must be (re)sent every time the socket
  // connects, including automatic reconnects after a network drop.
  private emitOnConnect = new Map<string, any>();

  constructor() {
    // this.url = "ws://localhost:8080";
    this.url = process.env.REACT_APP_WEBSOCKET_API_URL || "";
    this.initialize();
  }

  initialize(): void {
    if (this.socket) return;
    this.setLoading(true);
    this.connectFailed = false;
    const socket = io(this.url, {
      transports: ["websocket"],
    });
    this.socket = socket;
    socket.on("connect", () => {
      this.setLoading(false);
      this.connectFailed = false;
      this.emitOnConnect.forEach((data, event) => {
        socket.emit(event, data);
      });
    });
    socket.on("connect_error", () => {
      this.setLoading(false);
      this.connectFailed = true;
    });
  }

  connect(
    onMessage: (data: any) => void,
    onConnect?: () => void,
    onDisconnect?: () => void,
    onError?: (error: any) => void
  ) {
    const socket = this.getSocketInstance();
    if (socket) {
      if (onConnect) socket.on("connect", onConnect);
      if (onDisconnect) socket.on("disconnect", onDisconnect);
      if (onError) socket.on("connect_error", onError);
      socket.on("message", onMessage);
    }
  }

  isLoading() {
    return this.loading;
  }

  /** True after a connection attempt failed and no connection is open. */
  hasConnectionError() {
    return this.connectFailed && !this.isConnected();
  }

  private setLoading(val: boolean) {
    this.loading = val;
  }

  /**
   * Returns the socket, (re)creating it if it was closed. Components create
   * the service in useMemo and close it on unmount; React StrictMode (dev)
   * and fast remounts unmount+remount once, which used to leave the service
   * with no socket - every later send/listen was silently dropped and the
   * "Join game" page spun forever.
   */
  getSocketInstance() {
    if (!this.socket) {
      this.initialize();
    }
    return this.socket;
  }

  startListening(event: string, callback: Listener) {
    this.getSocketInstance()?.on(event, callback);
  }

  stopListening(event: string, callback?: Listener) {
    if (!this.socket) return;
    if (callback) this.socket.off(event, callback);
    else this.socket.off(event);
  }

  send(event: string, data: any) {
    // Deliberately does NOT recreate a closed socket: components send
    // GAME_END from their unmount cleanup after close(), and that must not
    // open a fresh connection that is then left dangling.
    // (socket.io buffers emits made before the connection opens.)
    this.socket?.emit(event, data);
  }

  /** Send now (if connected) and again after every (re)connect. */
  sendOnEveryConnect(event: string, data: any) {
    this.emitOnConnect.set(event, data);
    const socket = this.getSocketInstance();
    if (socket?.connected) {
      socket.emit(event, data);
    }
    // Not connected yet: the "connect" handler sends it.
  }

  close() {
    this.emitOnConnect.clear();
    if (this.socket) {
      this.socket.removeAllListeners();
      this.socket.disconnect();
      this.socket = null;
    }
    this.setLoading(false);
  }

  isConnected() {
    return this.socket !== null && this.socket.connected;
  }
}

export default WebSocketService;
