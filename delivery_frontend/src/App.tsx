import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import OrderList from './components/OrdersList/OrderList';
import OrderDetail from './components/OrderDetails/OrderDetail';
import axios from 'axios';
// import './App.css';
import './styles.css';
import Order from './app/Order';

function App() {
  const [newOrder, setNewOrder] = useState<Omit<Order, 'id'>>({
    senderCity: '',
    senderAddress: '',
    recipientCity: '',
    recipientAddress: '',
    cargoWeight: 0,
    pickupDate: formatDateTimeForInput(new Date()),
  });
  const [validationErrors, setValidationErrors] = useState<{ [key: string]: string }>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewOrder(prevOrder => ({
      ...prevOrder,
      [name]: value,
    }));
    setValidationErrors(prevErrors => ({ ...prevErrors, [name]: '' }));
  };

  const validateForm = () => {
    const errors: { [key: string]: string } = {};
    if (!newOrder.senderCity) errors.senderCity = 'Поле "Город отправителя" обязательно для заполнения';
    if (!newOrder.senderAddress) errors.senderAddress = 'Поле "Адрес отправителя" обязательно для заполнения';
    if (!newOrder.recipientCity) errors.recipientCity = 'Поле "Город получателя" обязательно для заполнения';
    if (!newOrder.recipientAddress) errors.recipientAddress = 'Поле "Адрес получателя" обязательно для заполнения';
    if (!newOrder.cargoWeight) errors.cargoWeight = 'Поле "Вес груза" обязательно для заполнения';
    if (!newOrder.pickupDate) errors.pickupDate = 'Поле "Дата забора груза" обязательно для заполнения';
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        const pickupDateISO = new Date(newOrder.pickupDate).toISOString();
        const orderToSend = { ...newOrder, pickupDate: pickupDateISO };

        await axios.post('http://localhost:5224/Orders', orderToSend);

        setNewOrder({
          senderCity: '',
          senderAddress: '',
          recipientCity: '',
          recipientAddress: '',
          cargoWeight: 0,
          pickupDate: formatDateTimeForInput(new Date()),
        });
        setValidationErrors({});
      } catch (error: any) {
        setError(error.message);
      }
    }
  };

  //  Функции для работы с датой
  function formatDateTimeForInput(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  }

  const [error, setError] = useState<string | null>(null);

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
          <Route
            path="/"
            element={
              <>
                <div className="formContainer">
                  <h1 className="formTitle" >Форма создания заказа</h1>
                  <form onSubmit={handleSubmit}>
                    <label className= "formLabel">
                      Город отправителя:
                      <input className= "formInput" type="text" name="senderCity" value={newOrder.senderCity} onChange={handleInputChange} />
                      {validationErrors.senderCity && <span className="error">{validationErrors.senderCity}</span>}
                    </label>
                    <label className= "formLabel">
                      Адрес отправителя:
                      <input className= "formInput" type="text" name="senderAddress" value={newOrder.senderAddress} onChange={handleInputChange} />
                      {validationErrors.senderAddress && <span className="error">{validationErrors.senderAddress}</span>}
                    </label>
                    <label className= "formLabel">
                      Город получателя:
                      <input className= "formInput" type="text" name="recipientCity" value={newOrder.recipientCity} onChange={handleInputChange} />
                      {validationErrors.recipientCity && <span className="error">{validationErrors.recipientCity}</span>}
                    </label>
                    <label className= "formLabel">
                      Адрес получателя:
                      <input className= "formInput" type="text" name="recipientAddress" value={newOrder.recipientAddress} onChange={handleInputChange} />
                      {validationErrors.recipientAddress && <span className="error">{validationErrors.recipientAddress}</span>}
                    </label>
                    <label className= "formLabel">
                      Вес груза:
                      <input className= "formInput" type="number" name="cargoWeight" value={newOrder.cargoWeight} onChange={handleInputChange} />
                      {validationErrors.cargoWeight && <span className="error">{validationErrors.cargoWeight}</span>}
                    </label>
                    <label className= "formLabel">
                      Дата отправки:
                      <input className= "formInput" type="datetime-local" name="pickupDate" value={newOrder.pickupDate} onChange={handleInputChange} />
                      {validationErrors.pickupDate && <span className="error">{validationErrors.pickupDate}</span>}
                    </label>
                    <div className= "form-submit">
                      <button type="submit" className= "formButton" >Сохранить</button>
                    </div>                    
                  </form>
                </div>
              </>
            }
          />
          <Route path="/orders" element={<OrderList />} />
          <Route path="/orders/:id" element={<OrderDetail />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
