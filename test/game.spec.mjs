import Game from '../src/components/Game.vue'
import {shallow} from '@vue/test-utils'
import 'regenerator-runtime';


describe('Game.vue', () => {
  const wrapper = shallow(Game)

  it('testing the game sequence generation', () => {

    wrapper.vm.generateSeqGame()

    const gameSeq = wrapper.vm.gameSequence

    expect(gameSeq.length).toBe(10)
  })

  it('testing the enabling/disabling of operation buttons', () => {
    wrapper.vm.playButtonClass = 'ui disabled button'
    wrapper.vm.stopButtonClass = 'ui button'

    wrapper.vm.enablePlayButton()

    expect(wrapper.vm.playButtonClass).toBe('ui button')
    expect(wrapper.vm.stopButtonClass).toBe('ui disabled button')
  })

  it('testing get ordered results', () => {

    const tempObj = {
      lastResults : [],

      sortByProperty: wrapper.vm.sortByProperty
    }

    const results =
      [
        {
          username : 'John',
          score: 3,
          gamedate: '2020-04-08'
        },
        {
          username : 'Maxwell',
          score: 7,
          gamedate: '2020-04-08'
        },
        {
          username : 'Lebron',
          score: 4,
          gamedate: '2020-04-08'
        },
        {
          username : 'William',
          score: 8,
          gamedate: '2020-04-08'
        },
        {
          username : 'Andreas',
          score: 4,
          gamedate: '2020-04-07'
        }

      ]

    wrapper.vm.getLastTenTopScores(tempObj, results)

    expect(tempObj.lastResults.length).toBe(5)
    expect(tempObj.lastResults[0].username).toBe('William')
    expect(tempObj.lastResults[4].username).toBe('John')
    expect(tempObj.lastResults[2].username).toBe('Lebron')

  })

} )
