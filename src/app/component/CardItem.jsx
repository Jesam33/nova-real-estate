// components/CartItem.js
import { useCart } from '@/app/context/context'

const CartItem = ({ item }) => {
  const { updateQuantity, removeFromCart } = useCart()

  const handleQuantityChange = (newQuantity) => {
    updateQuantity(item.cartId, newQuantity)
  }

  const handleRemove = () => {
    removeFromCart(item.cartId)
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-4 border border-gray-200">
      <div className="flex items-center space-x-4">
        <img 
          src={item.image} 
          alt={item.name}
          className="w-16 h-16 object-cover rounded-lg"
        />
        
        <div className="flex-1">
          <h3 className="font-semibold text-gray-800">{item.name}</h3>
          <p className="text-sm text-gray-600">
            Size: {item.size} | Flavour: {item.flavour}
          </p>
          <p className="text-lg font-bold text-pink-600">
            ${item.totalPrice} each
          </p>
        </div>
        
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => handleQuantityChange(item.quantity - 1)}
              className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300 transition-colors"
            >
              -
            </button>
            <span className="w-8 text-center font-semibold">{item.quantity}</span>
            <button
              onClick={() => handleQuantityChange(item.quantity + 1)}
              className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300 transition-colors"
            >
              +
            </button>
          </div>
          
          <button
            onClick={handleRemove}
            className="text-red-500 hover:text-red-700 transition-colors p-1"
            title="Remove from cart"
          >
            🗑️
          </button>
        </div>
      </div>
      
      <div className="mt-3 pt-3 border-t border-gray-200">
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Subtotal:</span>
          <span className="font-bold text-lg">${item.totalPrice * item.quantity}</span>
        </div>
      </div>
    </div>
  )
}

export default CartItem