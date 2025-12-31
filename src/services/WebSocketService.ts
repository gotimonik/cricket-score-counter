import { io, Socket } from "socket.io-client";

export class WebSocketService {
  private socket: Socket | null = null;
  private url: string;

  constructor() {
    // this.url = "ws://localhost:8080";
    this.url = process.env.REACT_APP_WEBSOCKET_API_URL || "";
    this.initialize();
  }

  initialize(): void {
    if (!this.socket) {
      this.socket = io(this.url, {
        transports: ["websocket"],
      });
    }
  }

  connect(
    onMessage: (data: any) => void,
    onConnect?: () => void,
    onDisconnect?: () => void,
    onError?: (error: any) => void
  ) {
    if (!this.socket) {
      this.initialize();
    } else {
      if (onConnect) this.socket.on("connect", onConnect);
      if (onDisconnect) this.socket.on("disconnect", onDisconnect);
      if (onError) this.socket.on("connect_error", onError);
      this.socket.on("message", onMessage);
    }
  }

  getSocketInstance() {
    if (!this.socket) {
      this.initialize();
    }
    return this.socket;
  }

  startListening(event: string, callback: (data: any) => void) {
    if (this.socket) {
      this.socket.on(event, callback);
    }
  }

  send(event: string, data: any) {
    if (this.socket) {
      this.socket.emit(event, data);
    }
  }

  close() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  isConnected() {
    return this.socket !== null && this.socket.connected;
  }
}

export default WebSocketService;
