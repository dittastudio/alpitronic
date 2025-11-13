import './progress-stepped.css'
import ProgressStepped from './progress-stepped'

new ProgressStepped({
  steps: ['Initialising', 'Ready', 'Preparing'],
  step: 0,
  selector: '[data-js-progress]',
})
