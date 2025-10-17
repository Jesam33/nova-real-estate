// context/CartContext.js
"use client"
import { createContext, useContext, useReducer } from 'react'

const CartContext = createContext()

const cartReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_TO_CART':
      const existingItem = state.find(item => 
        item.id === action.payload.id && 
        item.size === action.payload.size && 
        item.flavour === action.payload.flavour
      )
      
      if (existingItem) {
        return state.map(item =>
          item.id === action.payload.id && 
          item.size === action.payload.size && 
          item.flavour === action.payload.flavour
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      }
      
      return [...state, { ...action.payload, quantity: 1 }]
    
    case 'REMOVE_FROM_CART':
      return state.filter(item => item.cartId !== action.payload)
    
    case 'UPDATE_QUANTITY':
      return state.map(item =>
        item.cartId === action.payload.cartId
          ? { ...item, quantity: action.payload.quantity }
          : item
      )
    
    case 'CLEAR_CART':
      return []
    
    default:
      return state
  }
}

export const CartProvider = ({ children }) => {
  const [cart, dispatch] = useReducer(cartReducer, [])
  
  const addToCart = (cake) => {
    dispatch({ type: 'ADD_TO_CART', payload: cake })
  }
  
  const removeFromCart = (cartId) => {
    dispatch({ type: 'REMOVE_FROM_CART', payload: cartId })
  }
  
  const updateQuantity = (cartId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(cartId)
    } else {
      dispatch({ type: 'UPDATE_QUANTITY', payload: { cartId, quantity } })
    }
  }
  
  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' })
  }
  
  const getCartTotal = () => {
    return cart.reduce((total, item) => total + (item.totalPrice * item.quantity), 0)
  }
  
  const getCartCount = () => {
    return cart.reduce((count, item) => count + item.quantity, 0)
  }
  
  return (
    <CartContext.Provider value={{
      cart,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      getCartTotal,
      getCartCount
    }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}