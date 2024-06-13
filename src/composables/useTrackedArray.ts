import { ref, watch, onMounted, nextTick, toRaw } from 'vue'
import debounce from '@/utils/debounce'
import arrayDiff from '@/utils/arrayDiff'
import deepCopy from '@/utils/deepCopy'

export const useTrackedArray = ({ 
  fetch, 
  onUpdate, 
  onError = (error: Error) => { throw error },
  updateDebounceMs = 500,
  comparator = (a, b) => a.id === b.id,
  includeModified = true,
}: { 
  fetch: Function, 
  onUpdate: Function, 
  onError: Function,
  updateDebounceMs: number,
  comparator: (a: any, b: any) => boolean,
  includeModified: boolean
}) => {
  const loading = ref(false)
  const savedArray = ref([])
  const array = ref([])
  const dirty = ref(false)
  const updates = ref(0)

  const load = async () => {
    loading.value = true
    try {
      const data = await fetch()
      savedArray.value = data
      array.value = deepCopy(data)
    } 
    catch (error) {
      onError(error)
    }
    finally {
      loading.value = false
    }
    await nextTick()
    dirty.value = false
    loading.value = false
  }

  const handleUpdate = async () => {
    console.log('handleUpdate', toRaw(savedArray.value), toRaw(array.value))
    const diffArray = arrayDiff(toRaw(savedArray.value), toRaw(array.value), { comparator, includeModified })
    await onUpdate({ refresh: load, diffArray })
  }

  const debouncedHandleUpdate = updateDebounceMs ? debounce(handleUpdate, updateDebounceMs) : handleUpdate

  watch(
    updates,
    () => {
      dirty.value = true
      debouncedHandleUpdate()
    },
  )

  onMounted(async() => {
    await load()
    watch(
      array,
      () => updates.value++, 
      { deep: true }
    )
  })

  return {
    loading,
    array,
    dirty,
    refresh: load,
  }
}