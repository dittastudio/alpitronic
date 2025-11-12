import './progress-bar-large.css'
import './progress-bar-large.html?url'
import ProgressBarLarge from './progress-bar-large'

new ProgressBarLarge({
  percentage: 0,
  limit: 80,
  selector: '[data-js-progress]',
})
