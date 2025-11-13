import './progress-stepped.css'
import ProgressStepped from './progress-stepped'

new ProgressStepped({
  percentage: 0,
  limit: 80,
  selector: '[data-js-progress]',
})
