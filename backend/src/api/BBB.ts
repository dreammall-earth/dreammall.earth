import { createHash } from 'crypto'

import axios from 'axios'
import { XMLParser } from 'fast-xml-parser'

import { CONFIG } from '#config/config'

const parser = new XMLParser()

const axiosInstance = axios.create({
  baseURL: CONFIG.BBB_URL,
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
  },
})

axiosInstance.interceptors.request.use(
  function (config: any) {
    console.log(config)
    /*
  if (config.params) {
    config.params = {
      ...config.params,
      checksum: checksumFromParams(config.params)
    }
  }
  */
    if (!config.params) {
      config.params = {
        checksum: createChecksum('', config.url.substring(1)),
      }
    }
    console.log(config)
    return config
  },
  null,
  { synchronous: true },
)

export const createChecksum = (params: string, callName: string): string => {
  const hash = createHash('sha1')
  hash.update(callName + params + CONFIG.BBB_SHARED_SECRET)
  return hash.digest('hex')
}

export const getMeetings = async () => {
  try {
    const { data } = await axiosInstance.get('/getMeetings')
    const parsed = parser.parse(data)
    return parsed.response
  } catch (err) {
    console.log(err)
  }
}

export const create = async () => {}
