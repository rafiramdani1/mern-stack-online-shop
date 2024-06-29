import Midtrans from 'midtrans-client'
import { v4 } from 'uuid'

let snap = new Midtrans.Snap({
  isProduction: false,
  serverKey: process.env.SERVER_KEY_MIDTRANS,
  clientKey: process.env.CLIENT_KEY_MIDTRANS
})

export const getTokenPayment = async (req, res) => {
  try {
    const { transaction_details, item_details, customer_details, shipping_address } = req.body

    const orderId = v4();

    const truncatedItemName = item_details.name.length > 50 ? item_details.name.substring(0, 50) : item_details.name;

    let params = {
      "transaction_details": {
        "order_id": orderId,
        "gross_amount": transaction_details.gross_amount
      },
      "credit_card": {
        "secure": true
      },
      "item_details": [
        {
          "id": item_details.id,
          "price": item_details.price,
          "quantity": item_details.quantity,
          "name": truncatedItemName
        },
      ],
      "customer_details": {
        "first_name": customer_details.first_name,
        "last_name": customer_details.last_name,
        "email": customer_details.email,
        "phone": customer_details.phone,
        "shipping_address": {
          "first_name": shipping_address.first_name,
          "phone": shipping_address.phone,
          "address": shipping_address.address,
          "city": shipping_address.city,
        }
      }
    }
    const token = await snap.createTransactionToken(params)
    res.status(200).json(token)
  } catch (error) {
    console.log(error)
  }
}