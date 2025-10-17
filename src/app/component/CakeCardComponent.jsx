// components/CakeCard.js
"use client"
import { useState } from 'react'
import { useCart } from '@/app/context/context'

const CakeCard = ({ cake }) => {
  const [selectedSize, setSelectedSize] = useState('Medium')
  const [selectedFlavour, setSelectedFlavour] = useState(cake.flavours[0])
  const [showCustomization, setShowCustomization] = useState(false)
  const { addToCart } = useCart()

  const sizes = [
    { name: 'Small', multiplier: 0.8 },
    { name: 'Medium', multiplier: 1 },
    { name: 'Large', multiplier: 1.5 }
  ]

  const getCurrentPrice = () => {
    const sizeMultiplier = sizes.find(s => s.name === selectedSize)?.multiplier || 1
    const basePrice = cake.basePrice * sizeMultiplier
    
    // Apply discount if cake has one
    if (cake.discount && cake.discount > 0) {
      return Math.round(basePrice * (1 - cake.discount))
    }
    
    return Math.round(basePrice)
  }

  const getOriginalPrice = () => {
    const sizeMultiplier = sizes.find(s => s.name === selectedSize)?.multiplier || 1
    return Math.round(cake.basePrice * sizeMultiplier)
  }

  const handleAddToCart = () => {
    const cartItem = {
      id: cake.id,
      name: cake.name,
      image: cake.image,
      size: selectedSize,
      flavour: selectedFlavour,
      totalPrice: getCurrentPrice(),
      cartId: `${cake.id}-${selectedSize}-${selectedFlavour}-${Date.now()}`
    }
    
    addToCart(cartItem)
    setShowCustomization(false)
    
    // Show success message
    alert('Cake added to cart! 🎉')
  }

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
      <div className="relative">
        <img 
          src={cake.image} 
          alt={cake.name}
          className="w-full h-48 object-cover"
        />
        <div className="absolute top-2 right-2 bg-purple-600 text-white px-2 py-1 rounded-full text-sm font-semibold">
          {cake.discount ? (
            <div className="flex items-center space-x-1">
              <span className="line-through text-xs opacity-75">
                ${getOriginalPrice()}
              </span>
              <span>${getCurrentPrice()}</span>
            </div>
          ) : (
            <span>${getCurrentPrice()}</span>
          )}
        </div>
        
        {/* Discount Badge */}
        {cake.discount && (
          <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold">
            {Math.round(cake.discount * 100)}% OFF
          </div>
        )}
      </div>
      
      <div className="p-4">
        <h3 className="text-xl font-bold text-gray-800 mb-2">{cake.name}</h3>
        <p className="text-gray-600 mb-4">{cake.description}</p>
        
        {!showCustomization ? (
          <button
            onClick={() => setShowCustomization(true)}
            className="w-full bg-purple-800 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors font-semibold"
          >
            Customize & Add to Cart
          </button>
        ) : (
          <div className="space-y-4">
            {/* Size Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Size:
              </label>
              <div className="grid grid-cols-3 gap-2">
                {sizes.map(size => (
                  <button
                    key={size.name}
                    onClick={() => setSelectedSize(size.name)}
                    className={`py-2 px-3 rounded-lg border-2 transition-colors ${
                      selectedSize === size.name
                        ? 'border-pink-600 bg-pink-50 text-purple-600'
                        : 'border-gray-300 hover:border-pink-300'
                    }`}
                  >
                    {size.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Flavour Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Flavour:
              </label>
              <select
                value={selectedFlavour}
                onChange={(e) => setSelectedFlavour(e.target.value)}
                className="w-full p-2 border-2 border-gray-300 rounded-lg focus:border-pink-600 focus:outline-none"
              >
                {cake.flavours.map(flavour => (
                  <option key={flavour} value={flavour}>
                    {flavour}
                  </option>
                ))}
              </select>
            </div>

            {/* Price Display in Customization */}
            {cake.discount && (
              <div className="text-center">
                <span className="text-gray-500 line-through text-sm">
                  ${getOriginalPrice()}
                </span>
                <span className="text-pink-600 font-bold text-lg ml-2">
                  ${getCurrentPrice()}
                </span>
                <span className="text-green-600 font-semibold text-sm ml-2">
                  Save ${getOriginalPrice() - getCurrentPrice()}!
                </span>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex space-x-2">
              <button
                onClick={() => setShowCustomization(false)}
                className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAddToCart}
                className="flex-1 bg-pink-600 text-white py-2 px-4 rounded-lg hover:bg-pink-700 transition-colors font-semibold"
              >
                Add ${getCurrentPrice()}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default CakeCard