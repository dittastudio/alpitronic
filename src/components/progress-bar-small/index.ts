import './progress-bar-small.css'
import ProgressBarSmall from './progress-bar-small'

new ProgressBarSmall({
  percentage: 0,
  limit: 80,
  selector: '[data-js-progress]',
})
