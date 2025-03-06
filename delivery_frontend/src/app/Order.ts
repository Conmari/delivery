interface Order {
    id: number;
    senderCity: string;
    senderAddress: string;
    recipientCity: string;
    recipientAddress: string;
    cargoWeight: number;
    pickupDate: string; 
  }
  
  export default Order;