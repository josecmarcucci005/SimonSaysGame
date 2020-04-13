<template>
<div class="ui container">
  <br />
  <div class="ui blue inverted segment">
    <div class="ui internally grid">
      <div class="five wide  column"></div>
      <div class="seven wide column">
        <div class="ui blue inverted center">
          <h1 class="ui inverted center aligned header">SIMON SAYS GAME</h1>
        </div>
      </div>
    </div>
  </div>
  <game></game>
  <modal v-if="showModal" v-bind="{ 'lastResults': lastResults }"></modal>
</div>
</template>

<script>
import Game from './components/Game.vue';
import Modal from './components/Modal.vue';


export default {
  name: 'app',
  data() {
    return {
      lastResults: [],
      showModal: false
    }
  },
  components : {
    Game,
    Modal
  },
  mounted: function() {
    this.$root.$on('showModalEvent', (results) => {
      this.showModal = true;

      this.lastResults = results

      //this.$emit('updateResults', results);
    }),

    this.$root.$on('closeModalEvent', () => {
      this.showModal = false;
    })
  }
}
</script>

<style lang="scss">

</style>
