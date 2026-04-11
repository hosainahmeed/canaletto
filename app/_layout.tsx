import { ToastProvider } from '@/components/toast/ToastProvider';
import ReduxWrapper from './redux/query/ReduxWrapper';
import RootLayoutNav from './redux/query/RootLayoutNav';


export default function RootLayout() {

  return (
    <ReduxWrapper>
      <ToastProvider>
        <RootLayoutNav />
      </ToastProvider>
    </ReduxWrapper>
  );
}
