/**
 * heading-widget.state.js
 * State management logic for Heading Widget
 */

export class HeadingWidgetState {
  constructor(initialState = {}) {
    this.state = {
      title: '',
      subtitle: '',
      centered: false,
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

  setTitle(title) {
    this.setState({ title });
  }

  setSubtitle(subtitle) {
    this.setState({ subtitle });
  }

  setCentered(centered) {
    this.setState({ centered });
  }
}

export default HeadingWidgetState;

