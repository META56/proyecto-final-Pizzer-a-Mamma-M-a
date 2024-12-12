import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import axios from 'axios';

const Cart = () => {
  const { cart, removeFromCart } = useCart();
  const [isProcessing, setIsProcessing] = useState(false);
  const [checkoutSuccess, setCheckoutSuccess] = useState(false); 

  const handleCheckout = async () => {
    setIsProcessing(true);
    try {
      const response = await axios.post('/api/checkouts', cart);
      console.log('Checkout successful:', response.data);
      setCheckoutSuccess(true); 
    } catch (error) {
      console.error('Checkout failed:', error);
      
    } finally {
      setIsProcessing(false);
    }
  };

  useEffect(() => {
    const newTotal = cart.reduce((acc, product) => acc + product.price * product.quantity, 0);
    updateTotal(newTotal); 
  }, [cart, updateTotal]);

  return (
    <div>
      <h2>Carrito de compras</h2>
      {cart.length === 0 ? (
        <p>Tu carrito está vacío</p>
      ) : (
        <ul>
          {cart.map((product) => (
            <li key={product.id}>
              <h3>{product.name}</h3>
              <p>${product.price}</p>
              <button onClick={() => removeFromCart(product.id)}>Eliminar</button>
            </li>
          ))}
        </ul>
      )}
      <div>Total: ${total.toFixed(2)}</div>
      <button disabled={isProcessing} onClick={handleCheckout}>
        {isProcessing ? 'Procesando...' : 'Pagar'}
      </button>
      {checkoutSuccess && <p>¡Tu compra se ha realizado con éxito!</p>}
    </div>
  );
};

export default Cart;


