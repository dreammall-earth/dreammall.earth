import { InjectionKey, Ref } from 'vue'

export interface IsModeratorInjection {
  isModerator: Ref<boolean>
}

export const IsModeratorSymbol: InjectionKey<IsModeratorInjection> = Symbol(
  'isUserModeratorAtActiveTable',
)
