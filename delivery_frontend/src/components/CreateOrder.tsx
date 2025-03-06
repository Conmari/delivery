import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; 
import axios from 'axios';
import Order from '../app/Order';


const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

function CreateOrder() {

    const [newOrder, setNewOrder] = useState<Omit<Order, 'id'>>({
        senderCity: '',
        senderAddress: '',
        recipientCity: '',
        recipientAddress: '',
        cargoWeight: 0,
        pickupDate: formatDateTimeForInput(new Date()),
      });
    const [validationErrors, setValidationErrors] = useState<{ [key: string]: string }>({});
    const navigate = useNavigate(); 


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
    
            const response = await axios.post<Order>(`${API_BASE_URL}/Orders`, orderToSend); 


            const orderId = response.data.id;

            setNewOrder({
              senderCity: '',
              senderAddress: '',
              recipientCity: '',
              recipientAddress: '',
              cargoWeight: 0,
              pickupDate: formatDateTimeForInput(new Date()),
            });
            setValidationErrors({});
            setError(null);
    
            navigate(`/orders/${orderId}`);
          } catch (error: any) {
            setError(error.message);
            console.error("Error creating order:", error);
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
    );
}


export default CreateOrder;