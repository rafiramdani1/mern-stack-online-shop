import Cart from "../../models/cart.model.js";
import Product from "../../models/product.model.js";

const findCartByUserId = async (userId) => {
  const carts = await Cart.find({ userId }).populate('productId')
  return carts
}

const insertCart = async (dataProduct) => {
  const cartProduct = await new Cart({
    size: dataProduct.cartSizeId,
    qty: dataProduct.qty,
    noted: dataProduct.cartNote,
    total: dataProduct.total,
    productId: dataProduct.idProduct,
    userId: dataProduct.idUser
  }).save()
  return cartProduct
}

export const cartRepository = {
  insertCart,
  findCartByUserId,
} 