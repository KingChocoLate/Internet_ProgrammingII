<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref, computed } from 'vue'
import { useTodoStore } from '@/stores/todo.store'

const todoStore = useTodoStore()
const title = ref('')
const filter = ref<'all' | 'active' | 'done'>('all')
let stopRealtime: null | (() => void) = null

onMounted(async () => {
  await todoStore.fetchTodos()
  stopRealtime = todoStore.startRealtime()
})

onBeforeUnmount(() => stopRealtime?.())

function onAdd() {
  if (!title.value.trim()) return
  todoStore.addTodo(title.value)
  title.value = ''
}

const filteredTodos = computed(() => {
  if (filter.value === 'active') return todoStore.todos.filter(t => !t.is_done)
  if (filter.value === 'done') return todoStore.todos.filter(t => t.is_done)
  return todoStore.todos
})

const doneCount = computed(() => todoStore.todos.filter(t => t.is_done).length)
const activeCount = computed(() => todoStore.todos.filter(t => !t.is_done).length)
</script>

<template>
  <div class="app-bg">
    <div class="container">

      <!-- Header -->
      <header class="header">
        <div class="header-top">
          <span class="logo-dot"></span>
          <h1 class="logo-text">todos.</h1>
        </div>
        <p class="subtitle">{{ activeCount }} task{{ activeCount !== 1 ? 's' : '' }} remaining</p>
      </header>

      <!-- Add Todo -->
      <div class="add-box">
        <input
          v-model="title"
          class="add-input"
          placeholder="What needs to be done?"
          @keyup.enter="onAdd"
          maxlength="120"
        />
        <button class="add-btn" @click="onAdd" :disabled="!title.trim()">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
        </button>
      </div>

      <!-- Error -->
      <div v-if="todoStore.error" class="error-bar">
        ⚠ {{ todoStore.error }}
      </div>

      <!-- Filter Tabs -->
      <div class="tabs">
        <button
          v-for="tab in ['all', 'active', 'done']"
          :key="tab"
          class="tab"
          :class="{ active: filter === tab }"
          @click="filter = tab as any"
        >
          {{ tab.charAt(0).toUpperCase() + tab.slice(1) }}
          <span class="tab-count">
            {{ tab === 'all' ? todoStore.todos.length : tab === 'active' ? activeCount : doneCount }}
          </span>
        </button>
      </div>

      <!-- Loading -->
      <div v-if="todoStore.loading" class="loading">
        <span class="spinner"></span> Loading...
      </div>

      <!-- Todo List -->
      <ul v-else class="todo-list">
        <li
          v-if="filteredTodos.length === 0"
          class="empty-state"
        >
          <span v-if="filter === 'done'">No completed tasks yet 🎯</span>
          <span v-else-if="filter === 'active'">All caught up! 🎉</span>
        </li>

        <li
          v-for="todo in filteredTodos"
          :key="todo.id"
          class="todo-item"
          :class="{ done: todo.is_done }"
        >
          <button
            class="check-btn"
            :class="{ checked: todo.is_done }"
            @click="todoStore.toggleTodo(todo)"
            :aria-label="todo.is_done ? 'Mark undone' : 'Mark done'"
          >
            <svg v-if="todo.is_done" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
          </button>

          <span class="todo-title">{{ todo.title }}</span>

          <button
            class="delete-btn"
            @click="todoStore.deleteTodo(todo.id)"
            aria-label="Delete"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </li>
      </ul>

      <!-- Footer -->
      <footer class="footer" v-if="todoStore.todos.length > 0">
        <span>{{ doneCount }} / {{ todoStore.todos.length }} completed</span>
      </footer>

    </div>
  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=DM+Sans:wght@400;500;600&display=swap');

* { box-sizing: border-box; margin: 0; padding: 0; }

.app-bg {
  min-height: 100vh;
  background: #f5f0e8;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding: 60px 16px 40px;
  font-family: 'DM Sans', sans-serif;
}

.container {
  width: 100%;
  max-width: 540px;
}

/* Header */
.header {
  margin-bottom: 32px;
}
.header-top {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 4px;
}
.logo-dot {
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: #e05c3a;
  flex-shrink: 0;
}
.logo-text {
  font-family: 'DM Serif Display', serif;
  font-size: 42px;
  color: #1a1a1a;
  line-height: 1;
  letter-spacing: -1px;
}
.subtitle {
  font-size: 14px;
  color: #888;
  padding-left: 24px;
  font-weight: 500;
}

/* Add Box */
.add-box {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}
.add-input {
  flex: 1;
  padding: 14px 18px;
  border: 2px solid #e8e2d8;
  border-radius: 12px;
  background: #fff;
  font-family: 'DM Sans', sans-serif;
  font-size: 15px;
  color: #1a1a1a;
  outline: none;
  transition: border-color 0.2s;
}
.add-input::placeholder { color: #bbb; }
.add-input:focus { border-color: #e05c3a; }
.add-btn {
  width: 50px;
  height: 50px;
  border-radius: 12px;
  border: none;
  background: #e05c3a;
  color: #fff;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s, transform 0.1s;
  flex-shrink: 0;
}
.add-btn:hover:not(:disabled) { background: #c94d2e; }
.add-btn:active:not(:disabled) { transform: scale(0.95); }
.add-btn:disabled { background: #ddd; cursor: not-allowed; }

/* Error */
.error-bar {
  background: #fff0ee;
  border: 1px solid #f8c4ba;
  color: #c94d2e;
  border-radius: 10px;
  padding: 10px 14px;
  font-size: 14px;
  margin-bottom: 16px;
}

/* Tabs */
.tabs {
  display: flex;
  gap: 6px;
  margin-bottom: 16px;
}
.tab {
  flex: 1;
  padding: 8px 12px;
  border: 2px solid #e8e2d8;
  border-radius: 10px;
  background: #fff;
  font-family: 'DM Sans', sans-serif;
  font-size: 13px;
  font-weight: 600;
  color: #888;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  transition: all 0.15s;
}
.tab:hover { border-color: #e05c3a; color: #e05c3a; }
.tab.active {
  background: #e05c3a;
  border-color: #e05c3a;
  color: #fff;
}
.tab-count {
  background: rgba(255,255,255,0.25);
  border-radius: 20px;
  padding: 1px 7px;
  font-size: 11px;
}
.tab.active .tab-count { background: rgba(255,255,255,0.3); }
.tab:not(.active) .tab-count { background: #f0ebe3; color: #666; }

/* Loading */
.loading {
  display: flex;
  align-items: center;
  gap: 10px;
  color: #999;
  font-size: 14px;
  padding: 24px 0;
  justify-content: center;
}
.spinner {
  width: 18px;
  height: 18px;
  border: 2px solid #e8e2d8;
  border-top-color: #e05c3a;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }

/* Todo List */
.todo-list {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.empty-state {
  text-align: center;
  color: #aaa;
  font-size: 15px;
  padding: 40px 0;
}

.todo-item {
  display: flex;
  align-items: center;
  gap: 12px;
  background: #fff;
  border: 2px solid #e8e2d8;
  border-radius: 12px;
  padding: 14px 16px;
  transition: border-color 0.2s, opacity 0.2s;
}
.todo-item:hover { border-color: #d4cec6; }
.todo-item.done { opacity: 0.6; }

.check-btn {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  border: 2px solid #d4cec6;
  background: transparent;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: all 0.15s;
  color: #fff;
}
.check-btn:hover { border-color: #e05c3a; }
.check-btn.checked {
  background: #e05c3a;
  border-color: #e05c3a;
}

.todo-title {
  flex: 1;
  font-size: 15px;
  color: #1a1a1a;
  font-weight: 500;
  word-break: break-word;
  transition: all 0.2s;
}
.todo-item.done .todo-title {
  text-decoration: line-through;
  color: #aaa;
}

.delete-btn {
  width: 28px;
  height: 28px;
  border-radius: 8px;
  border: none;
  background: transparent;
  color: #ccc;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: all 0.15s;
  opacity: 0;
}
.todo-item:hover .delete-btn { opacity: 1; }
.delete-btn:hover { background: #fff0ee; color: #e05c3a; }

/* Footer */
.footer {
  margin-top: 20px;
  text-align: center;
  font-size: 13px;
  color: #bbb;
  font-weight: 500;
}
</style>