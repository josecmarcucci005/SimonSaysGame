<template>
<div>
  <div class="ui internally grid">
    <div class="eight wide column">
      <div class="ui secondary black segment">
        <div v-bind:class="alertClass" id="alertLabel" v-if="type">
          <p>
            {{errorMsg}}
          </p>
        </div>
        <div class="ui grid">
          <div class="ui row">
            <div class="three wide column"></div>
            <div class="seven wide center aligned column ">
              <div class="fullcircle">
                <div class="quarter quarter1" v-on:click="checkInput(1)"></div>
                <div class="quarter quarter2" v-on:click="checkInput(2)"></div>
                <div class="quarter quarter3" v-on:click="checkInput(3)"></div>
                <div class="quarter quarter4" v-on:click="checkInput(4)"></div>
                <div class="cutout"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="eight wide column">
      <div class="ui row">
        <div class="ui secondary black segment">
          <h2 class="ui center aligned header">PLAYING OPTIONS</h2>
          <br />
          <div class="ui internally  grid">
            <div class="eight wide column">
              <div class="ui  black segment">
                <p style="color: black; font-size: 18px;">
                  Choose a Level
                </p>
                <input class="rangeMedium" type="range" min="1" max="5" value="3" v-model="sliderVal" v-on:change="updateRange()" id="sliderVal" />
                <br>
                <p style="color: black; font-size: 15px;">
                  Level: <span>{{sliderVal}}</span>
                </p>
              </div>
            </div>
            <div class="eight wide column">
              <div class="ui  black segment">
                <p style="color: black; font-size: 18px;">
                  Operation
                  <p />
                <div class="ui teal big icon buttons">
                  <button v-bind:class="playButtonClass" title="Play" v-on:click="startGame()">
                    <i class="play icon"></i>
                  </button>
                  <button v-bind:class="stopButtonClass" title="Stop" v-on:click="stopGame()">
                    <i class="stop icon"></i>
                  </button>
                </div>
              </div>
            </div>
            <div class="sixteen wide column">
              <div class="ui  black segment">
                <p style="color: black; font-size: 18px;">
                  Enter your name
                </p>
                <div class="ui fluid input">
                  <input type="text" v-model="playerName" placeholder="John Travolta....">
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <br />
  <div class="ui blue  bottom attached button" tabindex="0">GalaxyDesign Copyright © 2020 All right reserved</div>
</div>
</template>

<script>
import 'regenerator-runtime';

const sleep = (milliseconds) => {
  return new Promise(resolve => setTimeout(resolve, milliseconds))
}

export default {
  name: 'game',
  data() {
    return {
      sliderVal: 3,
      timeSpeed: 1500,
      playerName: '',
      gameSequence: [],
      tempSeq: [],
      userIdx: 0,
      userScore: 0,

      isGameRunning: false,
      isSequenceReady: false,

      isSequenceCompleted: false,

      clickingOnProgress: false,

      playButtonClass: 'ui button',
      stopButtonClass: 'ui disabled button',

      lastResults: [],

      //for alert
      type: null,
      elapse: null,
      errorMsg: null,
      alertClass: 'ui red message',

      gameTimeout: null,

      //modal
      closeOnClickAway: true,
      animationDuration: 500,
      showModal: false,
      confirmed: true,

      urlService: 'https://simonsays-139d.restdb.io/rest/simonsays',

      colorSoundsArray: [
        'https://raw.githubusercontent.com/josecmarcucci005/simonSays/master/a_sharp.wav',
        'https://raw.githubusercontent.com/josecmarcucci005/simonSays/master/c_sharp.wav',
        'https://raw.githubusercontent.com/josecmarcucci005/simonSays/master/d_sharp.wav',
        'https://raw.githubusercontent.com/josecmarcucci005/simonSays/master/f_sharp.wav'
      ],

      applauseSound: 'https://raw.githubusercontent.com/josecmarcucci005/simonSays/master/applause.wav',

      failSound: 'https://raw.githubusercontent.com/josecmarcucci005/simonSays/master/aww.wav',

      letsGoSound: 'https://www.zapsplat.com/wp-content/uploads/2015/sound-effects-21014/zapsplat_multimedia_male_voice_processed_says_lets_go_001_23680.mp3?_=1'
    }
  },
  methods: {

    playSound: function(soundNm) {
      var audio = new Audio(soundNm);
      audio.play();
    },

    showAlert: function(type, errorMsg) {
      if (type === 'error') {
        this.alertClass = 'ui red message'
      } else {
        this.alertClass = 'ui green message'
      }

      this.type = type
      this.errorMsg = errorMsg

      let timer = this.showAlert.timer
      if (timer) {
        clearTimeout(timer)
      }

      this.showAlert.timer = setTimeout(() => {
        this.type = null
        this.errorMsg = null
      }, 2000)

      this.elapse = 1
      let t = this.showAlert.t
      if (t) {
        clearInterval(t)
      }

      this.showAlert.t = setInterval(() => {
        if (this.elapse === 3) {
          this.elapse = 0
          clearInterval(this.showAlert.t)
        } else {
          this.elapse++
        }
      }, 1000)
    },

    generateSeqGame : function() {
      var lastElement = 0
      while (this.gameSequence.length < 10) {
        var nextColor = Math.floor(Math.random() * 4) + 1

        if (lastElement !== nextColor) {
          this.gameSequence.push(nextColor)
          lastElement = nextColor
        }
      }
    },

    enablePlayButton : function() {
      this.playButtonClass = 'ui button'
      this.stopButtonClass = 'ui disabled button'
    },

    startGame: async function() {
      this.restartGame()

      this.playButtonClass = 'ui disabled button'
      this.stopButtonClass = 'ui button'

      this.isGameRunning = true

      this.playSound(this.letsGoSound)

      await sleep(2000)

      //Init sequence of Game
      this.generateSeqGame()

      //Execute Game
      this.tempSeq = []

      var i;
      for (i = 0; i < this.gameSequence.length; i++) {
        this.tempSeq.push(this.gameSequence[i])

        this.isSequenceReady = false

        this.isSequenceCompleted = false

        var j;
        for (j = 0; j < this.tempSeq.length; j++) {
          if (!this.isGameRunning) {
            this.playButtonClass = 'ui button'
            this.stopButtonClass = 'ui disabled button'

            return;
          }

          var classNm = 'quarter' + this.tempSeq[j]

          this.playSound(this.colorSoundsArray[this.tempSeq[j] - 1])

          await this.blinkElement(classNm)
        }

        this.gameTimeout = (new Date()).getTime() + 10000

        this.isSequenceReady = true

        while ((((new Date()).getTime()) <= this.gameTimeout) &&
          (!this.isSequenceCompleted)) {
          await sleep(1000)
        }

        if (!this.isSequenceCompleted && this.isGameRunning) {
          this.playSound(this.failSound)

          this.makeAxiosCallPost(this.urlService)

          this.restartGame()

          this.showAlert('error', 'Game Over! You run out of time!')
        } else {
          await sleep(2000)
        }

        if (!this.isGameRunning) {
          this.enablePlayButton()

          return;
        }
      }
      this.enablePlayButton()
    },

    sortByProperty: function(score, gamedate) {
      return function(a, b) {
        if (a[score] > b[score])
          return 1;
        else if (a[score] < b[score])
          return -1;
        else {
          if (a[gamedate] > b[gamedate])
            return 1;
          else if (a[gamedate] < b[gamedate])
            return -1
        }
        return 0;
      }
    },

    checkInput: async function(elementId) {
      if (!this.isSequenceReady || this.clickingOnProgress || this.isSequenceCompleted) {
        return
      }

      if (!this.isGameRunning) {
        return;
      }

      this.clickingOnProgress = true

      if (elementId === this.tempSeq[this.userIdx]) {
        this.gameTimeout = (new Date()).getTime() + 10000

        var classNm = 'quarter' + elementId

        this.playSound(this.colorSoundsArray[elementId - 1])

        await this.blinkElement(classNm)
      } else {

        this.playSound(this.failSound)

        this.makeAxiosCallPost(this.urlService)

        this.restartGame()

        this.showAlert('error', 'Game Over! You choose the incorrect color! Your score was: ' + this.userScore)
      }
      this.userIdx++

      if (this.userIdx === this.gameSequence.length) {
        this.userScore = this.userIdx

        this.playSound(this.applauseSound)

        this.makeAxiosCallPost(this.urlService)

        this.restartGame()

        this.showAlert('sucess', 'Well Done! You have completed the game. Your score was: ' + this.userScore)
      } else if (this.userIdx === this.tempSeq.length) {
        this.userScore = this.userIdx

        this.userIdx = 0

        this.showAlert('success', 'Good job!')

        this.isSequenceCompleted = true
      }

      this.clickingOnProgress = false
    },

    stopGame: function() {
      this.isGameRunning = false
      this.enablePlayButton()
    },

    restartGame: function() {
      this.gameSequence = []
      this.tempSeq = []
      this.userIdx = 0
      this.userScore = 0
      this.isGameRunning = false
      this.isSequenceReady = false
      this.isSequenceCompleted = false
    },

    blinkElement: async function(classNm) {
      var element = document.getElementsByClassName(classNm)[0];

      var timeout = (new Date()).getTime() + this.timeSpeed

      element.style.opacity = "1";

      while ((new Date()).getTime() <= timeout) {
        await sleep(200)
      }

      element.style.opacity = "0.4";
    },

    makeAxiosCallGet: function(temp, url, func) {
      var t = null

      try {

        axios.get(url, {
            headers: {
              'content-type': 'application/json',
              'x-apikey': '5e8db3b1111788414066c7d9',
              'cache-control': 'no-cache'
            },
            async: true,
            crossDomain: true,
            responseType: 'json',
            timeout: 30000
          })
          .then(function(response) {
            func(temp, response)
          })
          .catch(function(error) {
            console.log(error);
          })
      } catch (error) {
        console.log(error)
      }
    },

    makeAxiosCallPost: function(url) {
      let data = JSON.stringify({
        username: (this.playerName === '' ? 'Anonymous' : this.playerName),
        score: this.userScore,
        gamedate: new Date()
      })

      var temp = this

      axios.post(url, data, {
        headers: {
          'content-type': 'application/json',
          'x-apikey': '5e8db3b1111788414066c7d9',
          'cache-control': 'no-cache'
        },
        async: true,
        crossDomain: true
      }).then(function() {
        temp.makeAxiosCallGet(temp, temp.urlService, function(temp, response) {
          temp.getLastTenTopScores(temp, response.data)

          temp.showModal = true

          temp.$root.$emit('showModalEvent', temp.lastResults);
        })
      })
    },

    getLastTenTopScores : function(temp, results) {
      temp.lastResults = results

      temp.lastResults.sort(temp.sortByProperty('score', 'gamedate'))

      temp.lastResults.reverse()

      temp.lastResults = temp.lastResults.slice(0, 9)
    },

    updateRange: function() {
      var element = document.getElementById("sliderVal");

      switch (this.sliderVal) {
        case '1':
          element.className = 'rangeVeryEasy'
          this.timeSpeed = 2500
          break;
        case '2':
          element.className = 'rangeEasy'
          this.timeSpeed = 2000
          break;
        case '4':
          element.className = 'rangeHard'
          this.timeSpeed = 1000
          break;
        case '5':
          element.className = 'rangeVeryHard'
          this.timeSpeed = 500
          break;
        default:
          element.className = 'rangeMedium'
          this.timeSpeed = 1500
      }
    }
  }
}
</script>

<style lang="scss">
.quarter {
    position: absolute;
    width: 50%;
    height: 50%;
    transition: background-color 0.2s ease-in-out;
    cursor: pointer;
}

.quarter1 {
    top: 0;
    left: 0;
    --background: red;
    background: radial-gradient(circle at 100px 100px, red, #610202);
    border: 0.1rem solid #222222;
    border-radius: 100% 0 0 0;
    opacity: 0.4;
}

.quarter2 {
    top: 0;
    right: 0;
    --background-color: blue;
    background: radial-gradient(circle at 100px 100px, #20DEFC, #020995);
    border-radius: 0 100% 0 0;
    border: 0.1rem solid #222222;
    opacity: 0.4;
}

.quarter3 {
    bottom: 0;
    left: 0;
    --background-color: yellow;
    background: radial-gradient(circle at 100px 100px, yellow, #777703);
    border-radius: 0 0 0 100%;
    border: 0.1rem solid #222222;
    opacity: 0.4;
}

.quarter4 {
    bottom: 0;
    right: 0;
    --background-color: lime;
    background: radial-gradient(circle at 100px 100px, lime, #0F5501);
    border-radius: 0 0 100% 0;
    border: 0.1rem solid #222222;
    opacity: 0.4;
}

.cutout {
    width: 25%;
    height: 25%;
    background-color: #333333;
    background: radial-gradient(circle at 30px 100px, #555555, black);
    position: absolute;
    top: 37%;
    left: 37%;
    border-radius: 50%;
    pointer-events: none;
    text-align: center;
    color: white;
}

.fullcircle {
    position: relative;
    width: 350px;
    height: 350px;
    border-radius: 50%;
    background: #333333;
}

.rangeVeryEasy {
    -webkit-appearance: none;
    border-width: 2px;
    border-style: solid;
    background: #666666;
    border-radius: 50rem;
    border-color: rgba(0, 0, 0, 0.1);
    padding: 3px 5px;
}

.rangeVeryEasy::-webkit-slider-thumb {
    -webkit-appearance: none;
    background: blue;
    border-radius: 50rem;
    height: 0.8em;
    width: 0.8em;
}

.rangeEasy {
    -webkit-appearance: none;
    border-width: 2px;
    border-style: solid;
    background: #666666;
    border-radius: 50rem;
    border-color: rgba(0, 0, 0, 0.1);
    padding: 3px 5px;
}

.rangeEasy::-webkit-slider-thumb {
    -webkit-appearance: none;
    background: #89B84C;
    border-radius: 50rem;
    height: 0.8em;
    width: 0.8em;
}

.rangeMedium {
    -webkit-appearance: none;
    border-width: 2px;
    background: #666666;
    border-style: solid;
    border-radius: 50rem;
    border-color: rgba(0, 0, 0, 0.1);
    padding: 3px 5px;
}

.rangeMedium::-webkit-slider-thumb {
    -webkit-appearance: none;
    background: yellow;
    border-radius: 50rem;
    height: 0.8em;
    width: 0.8em;
}

.rangeHard {
    -webkit-appearance: none;
    border-width: 2px;
    border-style: solid;
    background: #666666;
    border-radius: 50rem;
    border-color: rgba(0, 0, 0, 0.1);
    padding: 3px 5px;
}

.rangeHard::-webkit-slider-thumb {
    -webkit-appearance: none;
    background: orange;
    border-radius: 50rem;
    height: 0.8em;
    width: 0.8em;
}

.rangeVeryHard {
    -webkit-appearance: none;
    border-width: 2px;
    border-style: solid;
    background: #666666;
    border-radius: 50rem;
    border-color: rgba(0, 0, 0, 0.1);
    padding: 3px 5px;
}

.rangeVeryHard::-webkit-slider-thumb {
    -webkit-appearance: none;
    background: red;
    border-radius: 50rem;
    height: 0.8em;
    width: 0.8em;
}
</style>
