import { createHash } from 'crypto'
import querystring, { ParsedUrlQueryInput } from 'node:querystring'

import axios, { InternalAxiosRequestConfig } from 'axios'

import { CONFIG } from '#config/config'

export const axiosInstance = axios.create({
  baseURL: CONFIG.BBB_URL,
  timeout: 25000,
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
  },
})

export const addChecksumParam = (
  config: InternalAxiosRequestConfig,
): InternalAxiosRequestConfig => {
  if (!config.params) {
    config.params = {
      checksum: createChecksum(config.url || CONFIG.BBB_URL),
    }
  } else {
    const checksumParams = querystring
      .stringify(config.params as ParsedUrlQueryInput | undefined)
      .replace(/%20/g, '+')
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    config.params = {
      ...config.params,
      checksum: createChecksum(config.url || CONFIG.BBB_URL, checksumParams),
    }
  }
  return config
}

axiosInstance.interceptors.request.use(addChecksumParam, null, { synchronous: true })

export const createChecksum = (callName: string, params: string = ''): string => {
  const hash = createHash('sha1')
  hash.update(
    (callName[0] === '/' ? callName.substring(1) : callName) + params + CONFIG.BBB_SHARED_SECRET,
  )
  return hash.digest('hex')
}
