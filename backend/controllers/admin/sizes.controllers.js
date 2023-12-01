import sizeAll from "../../models/size.model.js"

export const getSizes = async (req, res) => {
  try {
    const size = await sizeAll.find({})
    return res.json({ size })
  } catch (error) {
    console.log(error)
  }
}