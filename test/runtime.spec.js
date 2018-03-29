import { load } from './utils'
import { mount } from '@vue/test-utils'
import createRuntime from '../src/Runtime'

const injectStyles = () => {}

test('runtime', async () => {
  const injectStyles = jest.fn()

  const component = await load('./fixtures/basic')
  const wrapper = mount(createRuntime({ injectStyles })(component))

  expect(wrapper.find('div').text()).toEqual('Lorem ipsum')
  expect(injectStyles).toHaveBeenCalledTimes(1)
})

test('with filename', async () => {
  const component = await load('./fixtures/basic', { includeFileName: true })
  const exports = createRuntime({ injectStyles })(component)

  expect(exports.__file).toMatch('/fixtures/basic')
})

test('css modules / scope', async () => {
  const component = await load('./fixtures/styles')
  const wrapper = mount(createRuntime({ injectStyles })(component))

  const attrs = wrapper.find('div').attributes()
  const cssModules = component.cssModules

  expect(attrs).toHaveProperty(component.scopeId)
  expect(attrs.class).toEqual(`scoped ${cssModules.$style.module} ${cssModules.custom.custom}`)
})

test('functional component', async () => {
  const injectStyles = jest.fn()

  const component = await load('./fixtures/functional')
  const wrapper = mount(createRuntime({ injectStyles })(component))

  expect(injectStyles).toHaveBeenCalledTimes(1)
})

test('custom-blocks', async () => {
  const component = await load('./fixtures/customblock')
  const exports = createRuntime({ injectStyles })(component)

  expect(exports.foo).toEqual('bar')
})
