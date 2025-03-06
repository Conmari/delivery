import { BrowserRouter as Router, Route, Routes, Link} from 'react-router-dom';
import OrderList from './components/OrdersList/OrderList';
import OrderDetail from './components/OrderDetails/OrderDetail';
import CreateOrder from './components/CreateOrder';
// import './App.css';
import './styles.css';

function App() {
  
 
  return (
    <Router>
      <div className="App">
        <h1>Главная страница</h1>
        <nav>
          <ul>
            <li>
              <Link to="/">Создать заказ</Link>
            </li>
            <li>
              <Link to="/orders">Список заказов</Link>
            </li>
          </ul>
        </nav>
        
        <Routes>
          <Route path="/" element={<CreateOrder/>} />
          <Route path="/orders" element={<OrderList />} />
          <Route path="/orders/:id" element={<OrderDetail />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
