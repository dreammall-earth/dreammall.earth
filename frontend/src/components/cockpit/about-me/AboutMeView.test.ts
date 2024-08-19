import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { Component, h } from 'vue'
import { VApp } from 'vuetify/components'

import { SocialMedia, UserDetail } from '#stores/userStore'

import AboutMeView from './AboutMeView.vue'

describe('AboutMeView', () => {
  const Wrapper = ({
    userImage = 'https://image.url/image.jpg',
    initials = 'AB',
    details = [
      { id: 1, category: 'education', text: 'I am a student' },
      { id: 2, category: 'work', text: 'I am a worker' },
      { id: 3, category: 'work', text: 'I really like my job' },
      { id: 4, category: 'language', text: 'English' },
      { id: 5, category: 'place', text: 'Berlin' },
      { id: 6, category: 'feeling', text: 'Yeah!' },
    ] as UserDetail[],
    editable = false,
    username = 'username',
    name = 'name',
    availability = 'available' as const,
    social = [
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
  } = {}) =>
    mount(VApp, {
      slots: {
        default: h(AboutMeView as Component, {
          details,
          editable,
          username,
          name,
          social,
          availability,
          userImage,
          initials,
        }),
      },
    })

  it('renders', () => {
    const wrapper = Wrapper()
    expect(wrapper.findComponent(AboutMeView).element).toMatchSnapshot()
    wrapper.unmount()
  })

  it('renders without social media accounts', () => {
    const wrapper = Wrapper({ social: [] })
    expect(wrapper.findComponent(AboutMeView).element).toMatchSnapshot()
    wrapper.unmount()
  })

  it('renders initials', () => {
    const wrapper = Wrapper({ userImage: undefined })
    expect(wrapper.findComponent(AboutMeView).element).toMatchSnapshot()
    wrapper.unmount()
  })

  it('can edit name', async () => {
    const wrapper = Wrapper()
    await wrapper.find('.name').trigger('click')
    const input = wrapper.find('input[name="name"]')
    await input.setValue('New Name')
    expect(wrapper.findComponent(AboutMeView).emitted('update-name')).toEqual([['New Name']])
    wrapper.unmount()
  })

  it('can edit introduction', async () => {
    const wrapper = Wrapper()
    await wrapper.find('.introduction').trigger('click')
    const input = wrapper.find('input[name="introduction"]')
    await input.setValue('New Introduction')
    expect(wrapper.findComponent(AboutMeView).emitted('update-introduction')).toEqual([
      ['New Introduction'],
    ])
    wrapper.unmount()
  })
})
