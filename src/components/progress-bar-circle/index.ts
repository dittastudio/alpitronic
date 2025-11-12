import './progress-bar-circle.css'
import ProgressBarCircle from './progress-bar-circle'

new ProgressBarCircle({
  percentage: 0,
  limit: 80,
  selector: '[data-js-progress]',
})
