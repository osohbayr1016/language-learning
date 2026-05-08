type Listener = (accessToken: string) => void;
const listeners = new Set<Listener>();
const clearListeners = new Set<() => void>();

export function subscribeAccessTokenRefreshed(listener: Listener): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function emitAccessTokenRefreshed(accessToken: string): void {
  listeners.forEach((fn) => {
    fn(accessToken);
  });
}

/** refresh амжилтгүй — хадгалалтыг цэвэрлэсний дараа UI-г нэвтрээгүй болгоно. */
export function subscribeSessionCleared(listener: () => void): () => void {
  clearListeners.add(listener);
  return () => {
    clearListeners.delete(listener);
  };
}

export function emitSessionCleared(): void {
  clearListeners.forEach((fn) => {
    fn();
  });
}
