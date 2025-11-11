import './progress-bar-circle.css'
import './progress-bar-circle.html?url'
import ProgressBarCircle from './progress-bar-circle'

new ProgressBarCircle({
  percentage: 0,
  limit: 80,
  selector: '[data-js-progress]',
})
