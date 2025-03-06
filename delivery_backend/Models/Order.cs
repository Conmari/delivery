public class Order
    {
        public int Id { get; set; } 
        public string SenderCity { get; set; } = ""; // Город отправителя 
        public string SenderAddress { get; set; } = ""; // Адрес отправителя
        public string RecipientCity { get; set; } = ""; // Город получателя
        public string RecipientAddress { get; set; } = ""; // Адрес получателя
        public decimal CargoWeight { get; set; } // Вес груза
        public DateTime PickupDate { get; set; } // Дата забора груза
    }