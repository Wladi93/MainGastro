type EventHandler = (...args: unknown[]) => void;

class EventBusClass {
  private events: { [key: string]: EventHandler[] } = {};

  on(event: string, handler: EventHandler) {
    if (!this.events[event]) {
      this.events[event] = [];
    }
    this.events[event].push(handler);
  }

  off(event: string, handler?: EventHandler) {
    if (!this.events[event]) return;

    if (handler) {
      this.events[event] = this.events[event].filter((h) => h !== handler);
    } else {
      delete this.events[event];
    }
  }

  emit(event: string, ...args: unknown[]) {
    if (!this.events[event]) return;

    this.events[event].forEach((handler) => handler(...args));
  }
}

export const EventBus = new EventBusClass();
