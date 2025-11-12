import './progress-bar-large.css'
import ProgressBarLarge from './progress-bar-large'

new ProgressBarLarge({
  percentage: 0,
  limit: 80,
  selector: '[data-js-progress]',
})
