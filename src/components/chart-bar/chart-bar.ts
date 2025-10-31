const numBars = 80;
const labels = ['0%', '10%', '20%', '30%', '40%', '50%', '60%', '70%', '80%'];

function drawBars(container: HTMLElement, count: number) {
  container.innerHTML = '';

  for (let i = 0; i < count; i++) {
    const value = Math.random() * container.clientHeight;
    const bar = document.createElement('li');
    const width = 100 / count / 2;
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
  }
}

function drawLabelsX(container: HTMLElement) {
  container.innerHTML = '';

  labels.forEach(label => {
    const li = document.createElement('li');

    li.textContent = label;
    container.appendChild(li);
  });
}

function init() {
  const chart = document.querySelector('.chart-bar') as HTMLElement;

  if (!chart) {
    console.error('Chart bar element not found');
    return;
  }

  const bars = chart.querySelector('.chart-bar__bars') as HTMLElement;
  const labelsX = chart.querySelector('.chart-bar__labels-x') as HTMLElement;

  drawBars(bars, numBars);
  drawLabelsX(labelsX);
}

document.addEventListener('DOMContentLoaded', init);
