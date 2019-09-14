<template>
  <div class="text-center">
    <v-dialog v-model="value" width="500" @click:outside="done">
      <v-card>
        <v-card-title class="headline grey lighten-2" primary-title>{{title}}</v-card-title>
        <v-card-text>{{message}}</v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <div class="flex-grow-1"></div>
          <v-btn color="primary" text @click="done">Ok</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  props: ['value', 'title', 'message'],
  data: () => ({
  }),
  methods: {
    done: function() {
      this.$emit('input', false);
    }
  }
};
</script>