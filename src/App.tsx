import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Shell from './screens/Shell'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/*" element={<Shell />} />
      </Routes>
    </BrowserRouter>
  )
}
