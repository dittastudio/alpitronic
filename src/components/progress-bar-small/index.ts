import './progress-bar-small.css'
import './progress-bar-small.html?url'
import ProgressBarSmall from './progress-bar-small'

new ProgressBarSmall({
  percentage: 0,
  limit: 80,
  selector: '[data-js-progress]',
})
