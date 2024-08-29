import { mount } from '@vue/test-utils'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import StarMap from './StarMap.vue'
import * as THREE from 'three'
import { ref } from 'vue'
import { mockStarmapData } from './StarMapMockData'

// Mock Three.js
vi.mock('three', async () => {
  const actual = await vi.importActual('three')
  return {
    ...actual,
    WebGLRenderer: vi.fn(() => ({
      setSize: vi.fn(),
      setPixelRatio: vi.fn(),
      render: vi.fn(),
      shadowMap: { enabled: false },
      domElement: document.createElement('canvas'),
    })),
    PerspectiveCamera: vi.fn(() => ({
      aspect: 1,
      updateProjectionMatrix: vi.fn(),
      position: { set: vi.fn() },
      lookAt: vi.fn(),
    })),
    Scene: vi.fn(() => ({
      add: vi.fn(),
    })),
    Mesh: vi.fn(() => ({
      position: { set: vi.fn() },
    })),
    SphereGeometry: vi.fn(),
    MeshBasicMaterial: vi.fn(),
    LineBasicMaterial: vi.fn(),
    BufferGeometry: vi.fn(() => ({
      setFromPoints: vi.fn(),
    })),
    Line: vi.fn(),
    Vector3: vi.fn(),
  }
})

// Mock OrbitControls
vi.mock('three/examples/jsm/controls/OrbitControls.js', () => ({
  OrbitControls: vi.fn(() => ({
    update: vi.fn(),
  })),
}))

// Mock useQuery
vi.mock('@vue/apollo-composable', () => ({
  useQuery: vi.fn(() => ({
    result: ref(mockStarmapData),
  })),
}))

describe('StarMap', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders the canvas', () => {
    const wrapper = mount(StarMap)
    expect(wrapper.find('canvas').exists()).toBe(true)
  })

  it('initializes Three.js scene', () => {
    mount(StarMap)
    expect(THREE.Scene).toHaveBeenCalled()
    expect(THREE.PerspectiveCamera).toHaveBeenCalled()
    expect(THREE.WebGLRenderer).toHaveBeenCalled()
  })

//   it('adds stars to the scene', async () => {
//     const wrapper = mount(StarMap)
//     await wrapper.vm.$nextTick()
//     expect(THREE.Mesh).toHaveBeenCalledTimes(mockStarmapData.stars.length)
//     expect(THREE.SphereGeometry).toHaveBeenCalledTimes(mockStarmapData.stars.length)
//     expect(vi.mocked(THREE.Scene).mock.results[0].value.add).toHaveBeenCalledTimes(mockStarmapData.stars.length)
//   })

//   it('adds lines between stars in the scene', async () => {
//     const wrapper = mount(StarMap)
//     await wrapper.vm.$nextTick()
//     expect(THREE.Line).toHaveBeenCalledTimes(mockStarmapData.starLines.length)
//     expect(THREE.BufferGeometry).toHaveBeenCalledTimes(mockStarmapData.starLines.length)
//     expect(vi.mocked(THREE.Scene).mock.results[0].value.add).toHaveBeenCalledTimes(
//       mockStarmapData.stars.length + mockStarmapData.starLines.length
//     )
//   })

  it('handles window resize', async () => {
    const wrapper = mount(StarMap)
    await wrapper.vm.$nextTick()
    
    global.dispatchEvent(new Event('resize'))
    
    await wrapper.vm.$nextTick()
    
    expect(vi.mocked(THREE.PerspectiveCamera).mock.results[0].value.updateProjectionMatrix).toHaveBeenCalled()
    expect(vi.mocked(THREE.WebGLRenderer).mock.results[0].value.setSize).toHaveBeenCalled()
  })
})