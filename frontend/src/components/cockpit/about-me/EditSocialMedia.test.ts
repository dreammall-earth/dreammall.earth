import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { Component, h } from 'vue'
import { VApp } from 'vuetify/components'

import { SocialMedia } from '#stores/userStore'

import EditSocialMedia from './EditSocialMedia.vue'

describe('EditSocialMedia', () => {
  const Wrapper = (
    socials = [
      {
        id: 1,
        type: 'instagram',
        link: 'https://instagram.com',
      },
      {
        id: 2,
        type: 'facebook',
        link: 'https://facebook.com',
      },
      {
        id: 3,
        type: 'linkedin',
        link: 'https://linkedin.com',
      },
      {
        id: 4,
        type: 'x',
        link: 'https://x.com',
      },
      {
        id: 5,
        type: 'xing',
        link: 'https://xing.com',
      },
      { id: 6, type: 'discord', link: 'https://discord.com' },
      { id: 7, type: 'telegram', link: 'https://t.me' },
      { id: 8, type: 'snapchat', link: 'https://snapchat.com' },
      { id: 9, type: 'reddit', link: 'https://reddit.com' },
      { id: 10, type: 'whatsapp', link: 'https://wa.me' },
      { id: 11, type: 'pintarest', link: 'https://pinterest.com' },
      { id: 12, type: 'linkedin', link: 'https://linkedin.com' },
    ] as SocialMedia[],
  ) =>
    mount(VApp, {
      slots: {
        default: h(EditSocialMedia as Component, {
          socials,
        }),
      },
    })

  it('renders', () => {
    const wrapper = Wrapper()
    expect(wrapper.element).toMatchSnapshot()
  })

  /*
  it('emits add-social event', async () => {
    const wrapper = Wrapper()
    const component = wrapper.findComponent(EditSocialMedia)
    const nameInput = component.find('input[name="text"]')
    await nameInput.setValue('new-profile')
    await component.find('button.submit').trigger('click')
    expect(component.emitted('add-social')).toEqual([{ type: 'instagram', link: 'new-profile' }])
  })
  */
})
