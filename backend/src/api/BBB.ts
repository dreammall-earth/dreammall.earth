import { createHash } from 'crypto'
import querystring, { ParsedUrlQueryInput } from 'node:querystring'

import axios, { InternalAxiosRequestConfig } from 'axios'
import { XMLParser } from 'fast-xml-parser'

import { CONFIG } from '#config/config'

const parser = new XMLParser()

const axiosInstance = axios.create({
  baseURL: CONFIG.BBB_URL,
  timeout: 2500,
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

export const getMeetings = async () => {
  try {
    const { data } = await axiosInstance.get('/getMeetings')
    const parsed = parser.parse(data)
    return parsed.response
  } catch (err) {
    console.log(err)
  }
}

interface CreateMeetingOptions {
  name: string
  meetingID: string
  // welcome?: string
}

export const createMeeting = async (options: CreateMeetingOptions) => {
  const { name, meetingID /*, welcome */ } = options
  try {
    const { data } = await axiosInstance.post(
      '/create',
      {},
      {
        params: {
          name,
          meetingID,
          // welcome,
        },
      },
    )
    console.log(data)
    const parsed = parser.parse(data)
    console.log(parsed)
    return parsed.response
  } catch (err) {
    console.log(err)
  }
}
