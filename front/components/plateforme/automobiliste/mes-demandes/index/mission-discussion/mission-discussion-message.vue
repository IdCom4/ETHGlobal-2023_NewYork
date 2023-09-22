<template>
  <p class="mission-message" :class="[props.userId === props.message.senderId ? 'sender-message' : 'receiver-message']">
    {{ props.message.content }}
  </p>
</template>
<script lang="ts" setup>
const props = defineProps({
  message: {
    type: Object as PropType<IMessage>,
    default: () => ({})
  },
  userId: {
    type: String,
    default: ''
  }
})
</script>
<style lang="scss" scoped>
.mission-message {
  padding: 20px;
  color: $white;
  max-width: 321px;
  width: stretch;
  word-break: break-word;
}

.sender-message {
  align-self: flex-end;
  background-color: $color-message-sent;
  margin-left: 50px;
}

.receiver-message {
  align-self: flex-start;
  background-color: $black;
  margin-right: 50px;
}
</style>
