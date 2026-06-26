import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './config/queryClient';
import { AppRouter } from './router';
import { WhatsAppButton } from './components/contact/WhatsAppButton';
import './styles/globals.css';

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppRouter />
      <WhatsAppButton />
    </QueryClientProvider>
  );
}

export default App;
