import { defineStore } from 'pinia'
import { ref } from 'vue'
import { apolloClient } from '@/apollo/client'
import { GET_TODOS, ADD_TODO, TOGGLE_TODO, DELETE_TODO, TODOS_SUB } from '@/graphql/todos'

export type Todo = {
  id: string
  title: string
  is_done: boolean
  created_at: string
}

export const useTodoStore = defineStore('todo', () => {
  const todos = ref<Todo[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  // ─── Fetch (initial load only) ────────────────────────────────────────────
  async function fetchTodos() {
    loading.value = true
    error.value = null
    try {
      const { data } = await apolloClient.query<{ todos: Todo[] }>({
        query: GET_TODOS,
        fetchPolicy: 'network-only',
      })
      todos.value = data.todos
    } catch (e: any) {
      error.value = e.message ?? 'Failed to load todos'
    } finally {
      loading.value = false
    }
  }

  // ─── Add (Optimistic) ─────────────────────────────────────────────────────
  async function addTodo(title: string) {
    const clean = title.trim()
    if (!clean) return

    // 1. Create a temporary todo instantly (optimistic)
    const tempId = `temp-${Date.now()}`
    const optimisticTodo: Todo = {
      id: tempId,
      title: clean,
      is_done: false,
      created_at: new Date().toISOString(),
    }
    todos.value = [optimisticTodo, ...todos.value]

    try {
      // 2. Send to server in background
      const { data } = await apolloClient.mutate<{ insert_todos_one: Todo }>({
        mutation: ADD_TODO,
        variables: { title: clean },
      })

      // 3. Replace temp item with real server data
      const realTodo = data?.insert_todos_one
      if (realTodo) {
        todos.value = todos.value.map(t => t.id === tempId ? realTodo : t)
      }
    } catch (e: any) {
      // 4. Rollback on failure
      todos.value = todos.value.filter(t => t.id !== tempId)
      error.value = 'Failed to add todo — rolled back'
    }
  }

  // ─── Toggle (Optimistic) ──────────────────────────────────────────────────
  async function toggleTodo(todo: Todo) {
    // 1. Flip locally right away
    const prevDone = todo.is_done
    todos.value = todos.value.map(t =>
      t.id === todo.id ? { ...t, is_done: !t.is_done } : t
    )

    try {
      // 2. Sync with server
      await apolloClient.mutate({
        mutation: TOGGLE_TODO,
        variables: { id: todo.id, done: !prevDone },
      })
    } catch (e: any) {
      // 3. Rollback on failure
      todos.value = todos.value.map(t =>
        t.id === todo.id ? { ...t, is_done: prevDone } : t
      )
      error.value = 'Failed to update todo — rolled back'
    }
  }

  // ─── Delete (Optimistic) ──────────────────────────────────────────────────
  async function deleteTodo(id: string) {
    // 1. Remove locally right away
    const removed = todos.value.find(t => t.id === id)
    todos.value = todos.value.filter(t => t.id !== id)

    try {
      // 2. Delete on server
      await apolloClient.mutate({
        mutation: DELETE_TODO,
        variables: { id },
      })
    } catch (e: any) {
      // 3. Rollback — put it back if server fails
      if (removed) {
        todos.value = [...todos.value, removed].sort(
          (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        )
      }
      error.value = 'Failed to delete todo — rolled back'
    }
  }

  // ─── Real-time subscription (optional) ───────────────────────────────────
  function startRealtime() {
    const obs = apolloClient.subscribe<{ todos: Todo[] }>({ query: TODOS_SUB })
    const sub = obs.subscribe({
      next: ({ data }) => {
        if (data?.todos) todos.value = data.todos
      },
      error: (e) => console.error('Subscription error', e),
    })
    return () => sub.unsubscribe()
  }

  return {
    todos,
    loading,
    error,
    fetchTodos,
    addTodo,
    toggleTodo,
    deleteTodo,
    startRealtime,
  }
})