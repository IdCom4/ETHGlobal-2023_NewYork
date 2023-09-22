<template>
  <section class="message-page">
    <ul ref="scrollable" class="message-list">
      <template v-for="(message, index) in messageWithDates" :key="`message-${index}`">
        <p v-if="typeof message === 'string'" class="date-time">{{ message }}</p>
        <mission-discussion-message v-else :message="message" :user-id="user?._id" />
      </template>
    </ul>
    <button class="btn_call-to-action call-specialist" @click="callSpecialist()">Appelez le spécialiste</button>
    <div class="send-message">
      <div class="message-input">
        <input v-model="messageInput" type="text" placeholder="Ecrivez votre message ici" @keydown.enter="sendMessage" />
        <fa :icon="['far', 'paper-plane']" @click="sendMessage" />
      </div>
    </div>
  </section>
</template>
<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { GlobalEventTypes } from '@/types/constants'

const props = defineProps({
  mission: { type: Object as PropType<IPopulatedMission>, required: true },
  selectedEntry: { type: Object as PropType<IMissionProfessionalEntry>, required: true }
})

const { user } = storeToRefs(useSessionStore())
const isProfessionalSide: boolean = user.value?._id !== props.mission.clientRequest.client._id
const receiverId: string = isProfessionalSide ? props.mission.clientRequest.client._id : props.selectedEntry.professional._id
const messages = ref<IMessage[]>(props.selectedEntry.messages)

type TMessageDate = string
const dateUils = useUtils().dates

const min5 = 300
const messageList = ref<IMessage[]>([])
const messageInput = ref<string>('')
const scrollable = ref<HTMLElement>()

const populateMessageList = () => {
  if (!messages.value) return
  messageList.value = JSON.parse(JSON.stringify(messages.value)).map(cloneMessage)
  setMessagesAsSeen()
}

const setMessagesAsSeen = async () => {
  const userId = ref(user.value?._id)
  const callCondition = ref<boolean>(false)

  messageList.value.forEach((message) => {
    //Checks if the user received a message
    if (userId.value === message.receiverId) {
      //if yes, checks if that message has been seen
      if (userId.value && !message.seenByAt[userId.value]) callCondition.value = true
    }
  })

  if (userId.value && messageList.value.length && callCondition.value) {
    useAPI().missions.setMessageAsSeen(props.mission._id, props.selectedEntry.professional._id, messageList.value.length - 1)
    useGlobalEvents().emitEvent(GlobalEventTypes.MISSION_MESSAGES_SEEN, props.mission._id)
  }
}
const messageWithDates = computed<Array<IMessage | TMessageDate> | null>(() => {
  const newMessageWithDates = []
  let previousMessageDate = new Date(Date.now())
  if (!messageList.value) return null
  for (const message of messageList.value) {
    if (Math.abs(dateUils.getDiffTimeInSeconds(new Date(message.sentAt), previousMessageDate)) > min5) {
      newMessageWithDates.push(dateUils.getStrFromDate(new Date(message.sentAt), 'dd/MM à HH:mm'))
    }
    previousMessageDate = new Date(message.sentAt)
    newMessageWithDates.push(message)
  }
  return newMessageWithDates
})

function cloneMessage(message: IMessage) {
  message.sentAt = dateUils.getStrFromDate(new Date(message.sentAt))
  return message
}

function sendMessage() {
  if (!messageInput.value || !user.value) return

  //mocked implementation, keeping for reactivity purposes
  messageList.value.push({
    index: Math.random(),
    content: messageInput.value,
    senderId: user.value?._id,
    receiverId,
    sentAt: new Date().toISOString(),
    bySystem: false,
    seenByAt: {}
  })
  nextTick(() => {
    if (scrollable.value) {
      scrollable.value.scrollTo(0, scrollable.value.scrollHeight)
    }
  })

  // TODO: implement files
  //API support
  //No base64 supported yet
  const messagePayload = {
    receiverId,
    content: messageInput.value
  }

  useAPI().missions.sendMessageTo(props.mission._id, messagePayload)

  messageInput.value = ''
}
function callSpecialist() {
  window.open(`tel:1234567890`)
}
populateMessageList()
</script>
<style scoped lang="scss">
.message-wrapper {
  align-self: stretch;
  display: flex;
  align-items: stretch;

  &:has(.date-time) {
    align-self: center;
  }
}
.message-page {
  width: 100%;
  height: auto;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  background-color: $color-dark-blue;

  > ul {
    flex-grow: 1;
    padding: 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 50px;
    max-height: 800px;
    overflow-y: auto;
    scroll-behavior: smooth;
  }

  .call-specialist {
    align-self: center;
    margin-top: 50px;
    margin-bottom: 10px;
  }

  .date-time {
    color: $color-neon-blue;
  }
}

.send-message {
  padding: 20px;
  background-color: $color-grey;

  > .message-input {
    border: solid 1px $white;
    display: flex;
    padding: 10px;
    > input {
      width: 100%;
      color: white;
      background-color: transparent;
      border: none;
      outline: none;
    }

    > svg {
      color: $white;
      cursor: pointer;
    }

    ::placeholder {
      color: $color-light-grey;
    }
  }
}
</style>
