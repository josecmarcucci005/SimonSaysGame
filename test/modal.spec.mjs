
import Modal from '../src/components/Modal.vue'
import {shallow} from '@vue/test-utils'



describe('Modal.vue', () => {
  it('testing the content in modal', () => {

    const wrapper = shallow(Modal, {
      propsData : {
        lastResults : [
          {
            username : 'John',
            score: 5,
            gamedate: '2020-04-08'
          },
          {
            username : 'Maxwell',
            score: 4,
            gamedate: '2020-04-08'
          }
        ]
      }
    })

    const message = wrapper.find('h3').text();

    expect(message).toBe('LATEST TOP SCORES')

    const tableCells = wrapper.findAll('td')

    expect(tableCells.at(0).text()).toBe('John')
    expect(tableCells.at(1).text()).toBe('5')
    expect(tableCells.at(2).text()).toBe('2020-04-08')
    expect(tableCells.at(3).text()).toBe('Maxwell')
    expect(tableCells.at(4).text()).toBe('4')
    expect(tableCells.at(5).text()).toBe('2020-04-08')

  })
} )
