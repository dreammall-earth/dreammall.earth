import { reactive } from 'vue'

type MockPageContext = {
  urlPathname: string
  routeParams?: {
    id?: string | number
  }
}

export const mockPageContext: MockPageContext = reactive({
  urlPathname: '/some-url',
  urlParsed: {
    search: {},
  },
})
