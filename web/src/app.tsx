import { BrowserRouter, Routes, Route, Navigate } from 'react-router';
import { DocsLayout } from './components/layout';
import { HomePage, NotFound } from './pages';

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />

        <Route path="/docs" element={<Navigate to="/docs/introduction" />} />
        <Route path="/docs/*" element={<DocsLayout />} />

        <Route path="/docs/hooks" element={<Navigate to="/docs/hooks/use-counter" />} />


        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
