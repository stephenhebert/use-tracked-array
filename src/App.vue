<script setup lang="ts">
import { ref } from 'vue'
import { useTrackedArray } from '@/composables/useTrackedArray'

const {
  array: items,
  loading,
  dirty,
} = useTrackedArray({
  fetch: async () => {
    const response = await fetch('https://reqres.in/api/users')
    if (!response.ok) {
      throw new Error('Failed to fetch')
    }
    const responseJson = await response.json()
    return responseJson.data
  },
  onUpdate: async ({ diffArray, refresh }) => {
    console.log('onUpdate', diffArray)
  }
})

const operations = {
  add() {
    const randomIndex = Math.floor(Math.random() * items.value.length)
    items.value.splice(randomIndex, 0, { id: items.value.length + 1, name: 'New Item' })    
  },
  remove() {
    const randomIndex = Math.floor(Math.random() * items.value.length)
    items.value.splice(randomIndex, 1)
  },
  scrambleRandomItemName() {
    const randomIndex = Math.floor(Math.random() * items.value.length)
    const scrambleName = (name) => {
      return name.split('').sort(() => Math.random() - 0.5).map((char, index) => {
        return index === 0 ? char.toUpperCase() : char.toLowerCase()
      }).join('')
    }
    items.value[randomIndex].first_name = scrambleName(items.value[randomIndex].first_name)
    items.value[randomIndex].last_name = scrambleName(items.value[randomIndex].last_name)
  },
}

const doRandomOperation = () => {
  const keys = Object.keys(operations)
  const randomOperationKey = keys[Math.floor(Math.random() * keys.length)]
  const randomOperation = operations[randomOperationKey]
  console.log('doRandomOperation', randomOperationKey)
  randomOperation()
}
</script>

<template>
  <div>
    <div v-if="loading">
      Loading...
    </div>
    <div v-else>
      <pre>{{ items }}</pre>
      <pre>{{ dirty }}</pre>
      <div>
        <button @click="doRandomOperation">???</button>
      </div>
    </div>
  </div>

</template>
