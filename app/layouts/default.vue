
<template>
  <v-app class="app-shell">

    <!-- Sidebar -->
    <v-navigation-drawer
      v-model="drawer"
      :temporary="mobile"
      :permanent="!mobile"
      width="260"
      class="sidebar"
    >
      <!-- User Profile -->
      <div class="sidebar-user">
        <v-avatar size="46" class="profile-avatar">
          <v-img v-if="user?.picture" :src="user.picture" />
          <span v-else>{{ initials }}</span>
        </v-avatar>

        <div class="user-info">
          <strong>{{ user?.name || 'User' }}</strong>
          <small>{{ user?.email || '' }}</small>
        </div>
      </div>

      <!-- Navigation -->
      <v-list nav class="sidebar-nav">
        <v-list-item
          v-for="item in items"
          :key="item.to"
          :to="item.to"
          :prepend-icon="item.icon"
          :title="item.title"
          rounded="lg"
          exact
          class="nav-item"
          @click="closeDrawer"
        />
      </v-list>

      <!-- Logout -->
      <template #append>
        <div class="sidebar-bottom">
          <v-btn
            block
            color="error"
            variant="outlined"
            prepend-icon="mdi-logout"
            @click="logoutDialog = true"
          >
            Logout
          </v-btn>
        </div>
      </template>
    </v-navigation-drawer>

    <!-- Main Content -->
    <v-main>
      <header class="topbar">
        <v-btn
          v-if="mobile"
          icon="mdi-menu"
          variant="text"
          color="primary"
          @click="drawer = !drawer"
        />

        <h2>{{ pageTitle }}</h2>
      </header>

      <div class="page-content">
        <slot />
      </div>
    </v-main>

    <!-- Logout Confirmation -->
    <v-dialog v-model="logoutDialog" max-width="400">
      <v-card rounded="xl" class="logout-dialog">
        <v-card-text class="text-center">
          <v-icon color="error" size="40">
            mdi-logout
          </v-icon>

          <h3>Logout?</h3>

          <p>
            Are you sure you want to logout from your account?
          </p>
        </v-card-text>

        <v-card-actions class="logout-actions">
          <v-btn
            variant="outlined"
            color="grey-darken-1"
            @click="logoutDialog = false"
          >
            Cancel
          </v-btn>

          <v-btn
            color="error"
            variant="flat"
            @click="logout"
          >
            Logout
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

  </v-app>
</template>

<script setup lang="ts">
import { useDisplay } from 'vuetify'

const route = useRoute()
const { mobile } = useDisplay()

const drawer = ref(true)
const user = ref<any>(null)
const logoutDialog = ref(false)

const items = [
  {
    title: 'Dashboard',
    icon: 'mdi-view-dashboard-outline',
    to: '/'
  },
  {
    title: 'QR Scanner',
    icon: 'mdi-qrcode-scan',
    to: '/qr-scanner'
  },
  {
    title: 'Weather',
    icon: 'mdi-weather-partly-cloudy',
    to: '/weather'
  }
]

const initials = computed(() =>
  (user.value?.name || 'User')
    .split(' ')
    .map((word: string) => word[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
)

const pageTitle = computed(() =>
  route.path === '/'
    ? `Welcome, ${user.value?.name?.split(' ')[0] || 'User'}!`
    : items.find(item => item.to === route.path)?.title || 'Dashboard'
)

onMounted(() => {
  try {
    user.value = JSON.parse(
      localStorage.getItem('google_user') || 'null'
    )
  } catch {
    user.value = null
  }
})

function closeDrawer() {
  if (mobile.value) {
    drawer.value = false
  }
}

async function logout() {
  localStorage.removeItem('google_user')
  localStorage.removeItem('google_token')

  user.value = null
  logoutDialog.value = false

  await navigateTo('/login')
}
</script>

<style>
html,
body,
#__nuxt {
  min-height: 100%;
  margin: 0;
}

.v-application {
  font-family: Arial, sans-serif !important;
  background: #f6f8f7 !important;
}

/* Sidebar */
.sidebar {
  background: #ffffff !important;
  border-right: 1px solid #d8eae7 !important;
}

.sidebar-user {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 20px 16px;
  border-bottom: 1px solid #e5f0ee;
}

.profile-avatar {
  background: #6da9a2;
  color: white;
  font-weight: bold;
}

.user-info {
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.user-info strong {
  color: #315e5a;
  font-size: 14px;
}

.user-info small {
  overflow: hidden;
  margin-top: 4px;
  color: #718b88;
  font-size: 12px;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* Navigation Items */
.sidebar-nav {
  padding: 12px !important;
}

.nav-item {
  min-height: 48px !important;
  margin-bottom: 6px;
  color: #315e5a !important;
  opacity: 1 !important;
}

.nav-item :deep(.v-list-item-title) {
  color: #315e5a !important;
  font-size: 14px !important;
  font-weight: 600 !important;
  opacity: 1 !important;
}

.nav-item :deep(.v-icon) {
  color: #367a75 !important;
  opacity: 1 !important;
}

.nav-item.v-list-item--active {
  background: #e5f4f2 !important;
  color: #367a75 !important;
}

.nav-item.v-list-item--active :deep(.v-list-item-title),
.nav-item.v-list-item--active :deep(.v-icon) {
  color: #367a75 !important;
  opacity: 1 !important;
}

/* Sidebar Logout */
.sidebar-bottom {
  padding: 16px;
  border-top: 1px solid #e5f0ee;
}

/* Header */
.topbar {
  display: flex;
  align-items: center;
  gap: 12px;
  height: 64px;
  padding: 0 28px;
  background: #ddf2f0;
  border-bottom: 1px solid #c8e6e2;
}

.topbar h2 {
  color: #367a75;
  font-size: 20px;
  font-weight: 700;
}

/* Page Content */
.page-content {
  width: 100%;
  max-width: 1440px;
  margin: auto;
  padding: 28px;
}

/* Logout Dialog */
.logout-dialog {
  padding: 15px;
}

.logout-dialog h3 {
  margin-top: 12px;
  color: #315e5a;
  font-size: 20px;
}

.logout-dialog p {
  margin-top: 8px;
  color: #718b88;
  font-size: 14px;
}

.logout-actions {
  display: flex !important;
  justify-content: center;
  gap: 12px;
  padding: 12px 20px 20px;
}

.logout-actions .v-btn {
  flex: 1 1 0;
  min-width: 0;
  height: 42px;
  font-size: 14px;
  font-weight: 600;
  text-transform: none;
}

/* Mobile */
@media (max-width: 700px) {
  .topbar {
    height: 60px;
    padding: 0 16px;
  }

  .topbar h2 {
    font-size: 18px;
  }

  .page-content {
    padding: 20px 16px;
  }
}
</style>
