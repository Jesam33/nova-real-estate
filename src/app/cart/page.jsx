// pages/cart.js
"use client"
import { useState } from 'react'
import CartItem from '../component/CardItem'
import Link from 'next/link'
import { useCart } from '@/app/context/context'

export default function Cart() {
  const { cart, getCartTotal, clearCart } = useCart()
  const [isCheckingOut, setIsCheckingOut] = useState(false)

  const handleCheckout = () => {
    if (cart.length === 0) {
      alert('Your cart is empty!')
      return
    }

    setIsCheckingOut(true)
    
    // Generate WhatsApp message
    const orderDetails = cart.map(item => 
      `• ${item.name} (${item.size}, ${item.flavour}) - Qty: ${item.quantity} - $${item.totalPrice * item.quantity}`
    ).join('\n')
    
    const total = getCartTotal()
    const message = `🎂 *New Cake Order - Novacore*\n\nOrder Details:\n${orderDetails}\n\n*Total: $${total}*\n\nPlease confirm this order and provide:\n1. Delivery/Pickup preference\n2. Delivery address (if applicable)\n3. Preferred delivery date and time\n\nThank you for choosing Novacore! 🍰`
    
    const encodedMessage = encodeURIComponent(message)
    const whatsappURL = `https://wa.me/12265525489?text=${encodedMessage}`
    
    // Open WhatsApp
    window.open(whatsappURL, '_blank')
    
    // Reset checkout state
    setTimeout(() => {
      setIsCheckingOut(false)
    }, 2000)
  }

  const handleClearCart = () => {
    if (window.confirm('Are you sure you want to clear your cart?')) {
      clearCart()
    }
  }

  return (
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8 p-4">
          <h1 className="text-3xl font-bold text-purple-900">Your Cart</h1>
          <Link href="/" className="text-purple-600 hover:text-purple-800 font-medium">
            ← Go Back
          </Link>
        </div>

        {cart.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🛒</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Your cart is empty</h2>
            <p className="text-gray-600 mb-8">Add some delicious cakes to get started!</p>
            <Link href="/" className="bg-purple-600 text-white px-8 py-3 rounded-lg hover:bg-purple-700 transition-colors font-semibold">
              Browse Cakes
            </Link>
          </div>
        ) : (
          <>
            {/* Cart Items */}
            <div className="space-y-4 mb-8">
              {cart.map(item => (
                <CartItem key={item.cartId} item={item} />
              ))}
            </div>

            {/* Cart Summary */}
            <div className="bg-white rounded-lg shadow-lg p-6 border border-purple-100">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-800">Order Summary</h3>
                <button
                  onClick={handleClearCart}
                  className="text-red-500 hover:text-red-700 text-sm font-medium"
                >
                  Clear Cart
                </button>
              </div>
              
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-gray-600">
                  <span>Items ({cart.reduce((sum, item) => sum + item.quantity, 0)})</span>
                  <span>${getCartTotal()}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Delivery</span>
                  <span className="text-green-600">Free</span>
                </div>
                <hr className="my-4" />
                <div className="flex justify-between text-xl font-bold text-purple-900">
                  <span>Total</span>
                  <span>${getCartTotal()}</span>
                </div>
              </div>

              <div className="space-y-3">
                <button
                  onClick={handleCheckout}
                  disabled={isCheckingOut}
                  className="w-full bg-purple-600 text-white py-3 px-6 rounded-lg hover:bg-purple-700 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isCheckingOut ? 'Processing...' : 'Proceed to WhatsApp Checkout'}
                </button>
                
                <div className="text-center text-sm text-gray-500">
                  <p>🔒 Secure checkout via WhatsApp</p>
                  <p>You'll be redirected to WhatsApp to complete your order</p>
                </div>
              </div>
            </div>

            {/* Additional Info */}
            <div className="mt-8 bg-purple-50 rounded-lg p-6 border border-purple-200">
              <h4 className="font-semibold text-purple-900 mb-3">📋 Order Information</h4>
              <ul className="space-y-2 text-purple-800">
                <li>• Orders are processed within 24-48 hours</li>
                <li>• Free delivery within Lagos metropolis</li>
                <li>• Custom decorations available upon request</li>
                <li>• Contact us for special dietary requirements</li>
              </ul>
            </div>
          </>
        )}
      </div>
  )
}