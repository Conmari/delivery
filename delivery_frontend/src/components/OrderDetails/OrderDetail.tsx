import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom'; 
import Order from '../../app/Order';
import { format } from 'date-fns';
import '../OrderDetails/OrderDetails.css'; 

function OrderDetail() {
  const { id } = useParams<{ id: string }>(); 
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate(); 

  useEffect(() => {
    const fetchOrder = async () => {
      if (id) {
        try {
          const response = await axios.get<Order>(`http://localhost:5224/Orders/${id}`);
          setOrder(response.data);
          setLoading(false);
        } catch (error: any) {
          setError(error.message);
          setLoading(false);
        }
      }
    };

    fetchOrder();
  }, [id]);

  const handleDelete = async () => {
    if (order && order.id) {
      try {
        await axios.delete(`http://localhost:5224/Orders/${order.id}`);
        navigate('/orders'); 
      } catch (error: any) {
        setError(`Ошибка при удалении заказа: ${error.message}`);
      }
    }
  };

  if (loading) {
    return <div>Загрузка данных заказа...</div>;
  }

  if (error) {
    return <div>Ошибка: {error}</div>;
  }

  if (!order) {
    return <div>Заказ не найден.</div>;
  }

  return (
    <div className="order-details-container">
      <h1>Детали Заказа #{order.id}</h1>
      <p><strong>Город отправителя:</strong> {order.senderCity}</p>
      <p><strong>Адрес отправителя:</strong> {order.senderAddress}</p>
      <p><strong>Город получателя:</strong> {order.recipientCity}</p>
      <p><strong>Адрес получателя:</strong> {order.recipientAddress}</p>
      <p><strong>Вес груза:</strong> {order.cargoWeight}</p>
      <p><strong>Дата забора:</strong> {order.pickupDate
          ? format(new Date(order.pickupDate), 'dd.MM.yyyy HH:mm')
          : 'Не указана'}</p>
      <div className="order-details-buttons">
        <button onClick={() => navigate('/orders')}>К списку заказов</button>
        <button onClick={handleDelete}>Удалить заказ</button>
      </div>
      
    </div>
  );
}

export default OrderDetail;