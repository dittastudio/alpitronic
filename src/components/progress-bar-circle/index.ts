import './progress-bar-circle.css'
import './progress-bar-circle.html?url'
import Progress from './progress-bar-circle'

new Progress({
  percentage: 0,
  limit: 80,
  selector: '[data-js-progress]',
})
