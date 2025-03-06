import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Order from '../../app/Order';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import '../OrdersList/OrdersList.css'


function OrderList() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
  
    useEffect(() => {
      const fetchOrders = async () => {
        try {
          const response = await axios.get<Order[]>('http://localhost:5224/Orders');
          setOrders(response.data);
          setLoading(false);
        } catch (error: any) {
          setError(error.message);
          setLoading(false);
        }
      };
  
      fetchOrders();
    }, []);
  
    if (loading) {
      return <div>Загрузка списка заказов...</div>;
    }
  
    if (error) {
      return <div>Ошибка: {error}</div>;
    }
  
    return (
      <div className="orders-list-container">
          <h1>Список Заказов</h1>
          <div className="flex-table">
              <div className="flex-header">
                  <div>ID</div>
                  <div>Город отправителя</div>
                  <div>Адрес отправителя</div>
                  <div>Город получателя</div>
                  <div>Адрес получателя</div>
                  <div>Вес груза</div>
                  <div>Дата отправки</div>
              </div>
              {orders.map(order => (
                  <Link key={order.id} to={`/orders/${order.id}`} className="flex-row">
                      <div>{order.id}</div>
                      <div>{order.senderCity}</div>
                      <div>{order.senderAddress}</div>
                      <div>{order.recipientCity}</div>
                      <div>{order.recipientAddress}</div>
                      <div>{order.cargoWeight}</div>
                      <div>{format(new Date(order.pickupDate), 'dd.MM.yyyy HH:mm')}</div>
                  </Link>
              ))}
          </div>
      </div>
  );
}
  
  export default OrderList;