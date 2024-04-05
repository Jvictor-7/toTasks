import { BrowserRouter } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';

import RoutesApp from './routes/'

const App = () => {
  return (
    <div>
      <ToastContainer autoClose={3000} position='bottom-right' />
      <BrowserRouter>
        <RoutesApp />
      </BrowserRouter>
    </div>
  );
}

export default App;