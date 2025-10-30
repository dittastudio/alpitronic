/**
 * alert-widget.state.js
 * State management logic for Alert Widget
 */

export class AlertWidgetState {
  constructor(initialState = {}) {
    this.state = {
      visible: true,
      type: 'success',
      message: '',
      ...initialState
    };
    this.listeners = [];
  }

  getState() {
    return { ...this.state };
  }

  setState(updates) {
    this.state = { ...this.state, ...updates };
    this.notify();
  }

  subscribe(listener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  notify() {
    this.listeners.forEach(listener => listener(this.state));
  }

  show() {
    this.setState({ visible: true });
  }

  hide() {
    this.setState({ visible: false });
  }

  setType(type) {
    this.setState({ type });
  }

  setMessage(message) {
    this.setState({ message });
  }
}

export default AlertWidgetState;

