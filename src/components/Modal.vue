<template>
<div class="modal">
  <div class="modal-wrapper">
    <div class="modal-container">
      <content select=".modal-header">
        <div class="modal-header">
          <h3>
            LATEST TOP SCORES
          </h3>
        </div>
      </content>
      <div class="modal-body">
        <table slot="content" class="ui celled striped table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Score</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody v-for="row in lastResults" :key="row.id">
            <tr>
              <td>{{ row.username }}</td>
              <td>{{ row.score }}</td>
              <td>{{ row.gamedate }}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="modal-footer uk-clearfix">
        <button v-on:click="closeModal()" class="uk-button uk-button-success uk-float-right">Ok</button>
      </div>

    </div>
  </div>
</div>
</template>

<script>
export default {
  name: 'modal',
  props: ['lastResults'],
  data() {
    return {
    }
  },
  watch: {
      'lastResults' : function(results) {
         this.lastResults = results
      }
   },
  methods: {

    refreshList: function(results) {
      this.lastResults = results;
    },

    closeModal: function() {
      this.$root.$emit('closeModalEvent');
    }
  },
  mounted : function() {
    this.$parent.$on('updateResults', (results) => {
      console.log('cathed updateResults' + JSON.stringify(results))
      console.log(JSON.stringify(results))
      this.lastResults = results
    })

  }

}
</script>

<style lang="scss">
.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  display: table;
  transition: opacity 0.3s ease;
}

.modal-wrapper {
  display: table-cell;
  vertical-align: middle;
}

.modal-container {
  background: #fff;
  width: 450px;
  border-radius: 5px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
  transition: all 0.3s ease;
  margin: 0 auto;
  padding: 20px 30px;
}

.modal-footer {
  margin-top: 15px;
}

.modal-enter,
.modal-leave {
  opacity: 0;
}

.modal-enter .modal-container,
.modal-leave .modal-container {
  -webkit-transform: scale(1.1);
  transform: scale(1.1);
}
</style>
