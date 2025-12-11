import './mxm-chart-bar.css'
import ChartBar from './mxm-chart-bar'

new ChartBar({
  data: [0.2, 0.5, 0.8, 0.4, 0.9],
  xLabel: ['0%', '25%', '50%', '75%', '100%'],
  yLabel: ['High', 'Low'],
})
