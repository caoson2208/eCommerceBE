import { responseError } from './utils/response'
import { FOLDERS, FOLDER_UPLOAD, ROUTE_IMAGE } from './constants/config'
import { connectMongoDB } from './database/database'
import { isProduction } from './utils/helper'
import path from 'path'
import axios from 'axios'
import express from 'express'
import cors from 'cors'
import chalk from 'chalk'
import helmet from 'helmet'
import adminRoutes from './routes/common/index.route'
import commonRoutes from './routes/common/index.route'
import userRoutes from './routes/user/index.route'
require('dotenv').config()

interface MomoCallbackData {
  partnerCode: string
  orderId: string
  requestId: string
  amount: number
  orderInfo: string
  orderType: string
  transId: number
  resultCode: number
  message: string
  payType: string
  responseTime: number
  extraData: string
  signature: string
}

const app: express.Application = express()
connectMongoDB()
const routes = [{ ...commonRoutes }, { ...userRoutes }, { ...adminRoutes }]
app.use(helmet())
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

const dirNameWithEnv = isProduction ? path.dirname(__dirname) : __dirname

const handlerImage: any = Object.values(FOLDERS).reduce(
  (result: any, current: any) => {
    return [
      ...result,
      express.static(path.join(dirNameWithEnv, `/${FOLDER_UPLOAD}/${current}`)),
    ]
  },
  [express.static(path.join(dirNameWithEnv, `/${FOLDER_UPLOAD}`))]
)

app.use(`/${ROUTE_IMAGE}`, ...handlerImage)

routes.forEach((item) =>
  item.routes.forEach((route) => app.use(item.prefix + route.path, route.route))
)

app.use(function (err: any, req: any, res: any, next: any) {
  responseError(res, err)
})

app.listen(process.env.PORT, function () {
  console.log(chalk.greenBright(`API listening on port ${process.env.PORT}!`))
})

app.post(
  '/api/payment',
  async (req: express.Request, res: express.Response) => {
    const accessKey = 'F8BBA842ECF85'
    const secretKey = 'K951B6PE1waDMi640xX08PD3vg6EkVlz'
    const orderInfo = 'pay with MoMo'
    const partnerCode = 'MOMO'
    const redirectUrl =
      'https://webhook.site/b3088a6a-2d17-4f8d-a383-71389a6c600b'
    const ipnUrl = 'https://webhook.site/b3088a6a-2d17-4f8d-a383-71389a6c600b'
    const requestType = 'payWithMethod'
    const amount = '50000'
    const orderId = `${partnerCode}${new Date().getTime()}`
    const requestId = orderId
    const extraData = ''
    const autoCapture = true
    const lang = 'vi'

    // Before signing HMAC SHA256 with format
    const rawSignature = `accessKey=${accessKey}&amount=${amount}&extraData=${extraData}&ipnUrl=${ipnUrl}&orderId=${orderId}&orderInfo=${orderInfo}&partnerCode=${partnerCode}&redirectUrl=${redirectUrl}&requestId=${requestId}&requestType=${requestType}`

    console.log('--------------------RAW SIGNATURE----------------')
    console.log(rawSignature)

    // Signature
    const signature = require('crypto')
      .createHmac('sha256', secretKey)
      .update(rawSignature)
      .digest('hex')
    console.log('--------------------SIGNATURE----------------')
    console.log(signature)

    // JSON object to send to MoMo endpoint
    const requestBody = {
      partnerCode: partnerCode,
      partnerName: 'Test',
      storeId: 'MomoTestStore',
      requestId: requestId,
      amount: amount,
      orderId: orderId,
      orderInfo: orderInfo,
      redirectUrl: redirectUrl,
      ipnUrl: ipnUrl,
      lang: lang,
      requestType: requestType,
      autoCapture: autoCapture,
      extraData: extraData,
      orderGroupId: '',
      signature: signature,
    }

    try {
      const result = await axios.post(
        'https://test-payment.momo.vn/v2/gateway/api/create',
        requestBody,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      )
      return res.status(200).json(result.data)
    } catch (error) {
      console.error('Lỗi khi thực hiện giao dịch:', error)
      return res.status(500).json({ error: 'Lỗi khi thực hiện giao dịch' })
    }
  }
)

app.post('/callback', async (req: express.Request, res: express.Response) => {
  console.log('callback:')
  console.log(req.body)

  const callbackData = req.body as MomoCallbackData

  if (callbackData.resultCode === 0) {
    console.log('Giao dịch thành công.')
  } else if (callbackData.resultCode === 9000) {
    console.log('Giao dịch được cấp quyền thành công.')
  } else {
    console.log('Giao dịch thất bại.')
  }

  return res.status(204).json(callbackData)
})

app.post('/check-status-transaction', async (req, res) => {
  const { orderId } = req.body

  const secretKey = 'K951B6PE1waDMi640xX08PD3vg6EkVlz'
  const accessKey = 'F8BBA842ECF85'
  const partnerCode = 'MOMO'

  const rawSignature = `accessKey=${accessKey}&orderId=${orderId}&partnerCode=${partnerCode}&requestId=${orderId}`

  const signature = require('crypto')
    .createHmac('sha256', secretKey)
    .update(rawSignature)
    .digest('hex')

  const requestBody = {
    partnerCode: partnerCode,
    requestId: orderId,
    orderId: orderId,
    signature: signature,
    lang: 'vi',
  }

  try {
    // Đảm bảo rằng URL là chính xác
    const url = 'https://test-payment.momo.vn/v2/gateway/api/query'

    // Gửi yêu cầu Axios đến API của MoMo
    const result = await axios.post(url, requestBody, {
      headers: {
        'Content-Type': 'application/json',
      },
    })
    return res.status(200).json(result.data)
  } catch (error) {
    console.error('Lỗi khi truy vấn trạng thái giao dịch:', error.message)
    return res.status(500).json({ error: error.message })
  }
})
