import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'

import SectionColumnCard from '#components/layout/SectionColumnCard.vue'

import ThirdSection from './ThirdSection.vue'

describe('ThirdSection', () => {
  const wrapper = mount(ThirdSection)

  it('renders ThirdSection', () => {
    expect(wrapper.find('.section3').exists()).toBeTruthy()
  })

  it('renders three columns', () => {
    expect(wrapper.find('.card-row').exists()).toBeTruthy()
    expect(wrapper.findAll('.card-row > div')).toHaveLength(3)
  })

  it('first column contains card component', () => {
    expect(wrapper.findAll('.v-row > div')[0].findComponent(SectionColumnCard)).toBeTruthy()
  })

  it('second column contains card component', () => {
    expect(wrapper.findAll('.v-row > div')[1].findAllComponents(SectionColumnCard)).toBeTruthy()
  })
  it('third column contains card component', () => {
    expect(wrapper.findAll('.v-row > div')[2].findAllComponents(SectionColumnCard)).toBeTruthy()
  })
})
