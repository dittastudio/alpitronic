interface Options {
  data?: number[];
  xLabel?: string[];
  yLabel?: string[];
  selector?: string;
}

class ChartBar {
  private data: number[];
  private xLabel: string[];
  private yLabel: string[];
  private chart: HTMLElement | null = null;
  private barsContainer: HTMLElement | null = null;
  private xLabelContainer: HTMLElement | null = null;
  private yLabelContainer: HTMLElement | null = null;

  constructor(options: Options = {}) {
    const { data = [], xLabel = [], yLabel = [], selector = '.chart-bar' } = options;

    this.data = data;
    this.xLabel = xLabel;
    this.yLabel = yLabel;
    this.chart = document.querySelector(selector);

    if (!this.chart) {
      console.warn(`Chart element with selector "${selector}" not found`);
      return;
    }

    this.barsContainer = this.chart.querySelector('.chart-bar__bars');
    this.xLabelContainer = this.chart.querySelector('.chart-bar__x-label');
    this.yLabelContainer = this.chart.querySelector('.chart-bar__y-label');

    this.init();
  }

  private drawBars(container: HTMLElement): void {
    container.innerHTML = '';

    if (!Array.isArray(this.data) || !this.data.length) {
      return;
    }

    this.data.forEach(data => {
      const value = data * container.clientHeight;
      const bar = document.createElement('li');
      const width = 100 / this.data.length / 2;
      const height = (value / container.clientHeight) * 100;
      const colour = height <= 25 ? 'bg-red' : 'bg-green';

      bar.className = `${colour} rounded`;
      bar.style.width = `${width}%`;
      bar.style.height = `${height}%`;

      const content = document.createElement('span');
      content.textContent = `${Math.round(height)}%`;
      content.className = 'sr-only';

      bar.appendChild(content);
      container.appendChild(bar);
    });
  }

  private drawXLabel(container: HTMLElement): void {
    container.innerHTML = '';

    if (!Array.isArray(this.xLabel) || !this.xLabel.length) {
      return;
    }

    this.xLabel.forEach(label => {
      const li = document.createElement('li');
      li.textContent = label;
      container.appendChild(li);
    });
  }

  private drawYLabel(container: HTMLElement): void {
    container.innerHTML = '';

    if (!Array.isArray(this.yLabel) || !this.yLabel.length) {
      return;
    }

    this.yLabel.forEach(label => {
      const li = document.createElement('li');
      li.textContent = label;
      container.appendChild(li);
    });
  }

  private init(): void {
    if (this.barsContainer) {
      this.drawBars(this.barsContainer);
    }

    if (this.xLabelContainer) {
      this.drawXLabel(this.xLabelContainer);
    }

    if (this.yLabelContainer) {
      this.drawYLabel(this.yLabelContainer);
    }
  }
}

export default ChartBar;
