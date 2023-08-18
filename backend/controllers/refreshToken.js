import Users from "../models/users.model.js";
import jwt from 'jsonwebtoken'

export const refreshToken = async (req, res) => {
  const refreshToken = req.cookies.refreshToken
  if (!refreshToken) return res.status(401).json({ msg: 'Authentikasi gagal!' })
  const user = await Users.findOne({ refresh_token: refreshToken })
  if (!user) return res.status(403)
  try {
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN, (err, decoded) => {
      if (err) return res.sendStatus(403)
      const data = { userId: user._id, username: user.username, email: user.email, role: user.role, }
      const accessToken = jwt.sign(data, process.env.ACCESS_TOKEN, { expiresIn: '15s' })
      res.json({ accessToken })
    })
  } catch (error) { console.log(error) }
}