import { BrowserRouter as Router } from 'react-router-dom'
import AppRouter from '../components/AppRouter'

export default function ClientProvider() {
  return (
    <Router>
      <AppRouter />
    </Router>
  )
}
