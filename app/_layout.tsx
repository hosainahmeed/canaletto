import { ToastProvider } from '@/components/toast/ToastProvider';
import { ChatProvider } from './context/ChatContext';
import ReduxWrapper from './redux/query/ReduxWrapper';
import RootLayoutNav from './redux/query/RootLayoutNav';


export default function RootLayout() {

  return (
    <ReduxWrapper>
      <ChatProvider>
        <ToastProvider>
          <RootLayoutNav />
        </ToastProvider>
      </ChatProvider>
    </ReduxWrapper>
  );
}
