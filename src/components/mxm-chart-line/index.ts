import './mxm-chart-line.css'
import ChartLine from './mxm-chart-line'

new ChartLine({
  data: [0.2, 0.5, 0.8, 0.4, 0.9],
  xLabel: ['0%', '25%', '50%', '75%', '100%'],
  yLabel: ['High', 'Low'],
})
