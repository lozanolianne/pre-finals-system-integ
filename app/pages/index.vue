
<template>
  <div class="dashboard">
    <!-- Profile Card -->
    <v-card class="profile-card" rounded="xl" elevation="0">
      <div class="profile-content">
        <v-avatar size="76" class="profile-avatar">
          <v-img
            v-if="user?.picture"
            :src="user.picture"
            alt="Profile picture"
          />
          <span v-else>{{ initials }}</span>
        </v-avatar>

        <div>
          <h3>{{ user?.name || 'User' }}</h3>
          <p>{{ user?.email || '' }}</p>

          <v-chip color="success" variant="tonal" size="small" class="mt-3">
            <v-icon start size="14">mdi-check-circle</v-icon>
            Verified account
          </v-chip>
        </div>
      </div>
    </v-card>

    <!-- Available Tools -->
    <div class="section-heading">
      <h2>Available Tools</h2>
      <p>Choose a tool to get started.</p>
    </div>

    <v-row class="tool-row">
      <v-col cols="12" sm="6">
        <v-card class="tool-card" rounded="xl" elevation="0" to="/qr-scanner">
          <div class="tool-icon">
            <v-icon size="28">mdi-qrcode-scan</v-icon>
          </div>

          <h3>QR Scanner</h3>
          <p>Scan QR codes using your camera.</p>

          <div class="tool-link">
            Open tool
            <v-icon size="18">mdi-arrow-right</v-icon>
          </div>
        </v-card>
      </v-col>

      <v-col cols="12" sm="6">
        <v-card class="tool-card" rounded="xl" elevation="0" to="/weather">
          <div class="tool-icon">
            <v-icon size="28">mdi-weather-partly-cloudy</v-icon>
          </div>

          <h3>Weather</h3>
          <p>View current weather and forecasts.</p>

          <div class="tool-link">
            Open tool
            <v-icon size="18">mdi-arrow-right</v-icon>
          </div>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script setup lang="ts">
const user = ref<any>(null)

const initials = computed(() =>
  (user.value?.name || 'U')
    .split(' ')
    .map((part: string) => part[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
)

onMounted(() => {
  try {
    user.value = JSON.parse(localStorage.getItem('google_user') || 'null')
  } catch {
    user.value = null
  }
})
</script>

<style scoped>
.dashboard {
  width: 100%;
  min-height: calc(100vh - 120px);
}

/* Profile */
.profile-card {
  width: 100%;
  margin-bottom: 30px;
  background: #e5f4f2;
  border: 1px solid #c8e6e2;
  border-left: 5px solid #6da9a2;
}

.profile-content {
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 28px;
}

.profile-avatar {
  flex-shrink: 0;
  background: #6da9a2;
  color: white;
  font-weight: 700;
}

.profile-info h3,
.profile-content h3 {
  color: #315e5a;
  font-size: 19px;
  font-weight: 700;
}

.profile-content p {
  color: #718b88;
  font-size: 14px;
  margin-top: 5px;
}

/* Section */
.section-heading {
  margin-bottom: 18px;
}

.section-heading h2 {
  color: #315e5a;
  font-size: 21px;
  font-weight: 700;
}

.section-heading p {
  color: #718b88;
  font-size: 13px;
  margin-top: 5px;
}

/* Tool Cards */
.tool-row {
  width: 100%;
}

.tool-card {
  width: 100%;
  height: 100%;
  min-height: 205px;
  padding: 22px;
  background: white;
  border: 1px solid #d8eae7;
  transition: 0.2s ease;
}

.tool-card:hover {
  transform: translateY(-3px);
  border-color: #8dbdb6;
  box-shadow: 0 6px 18px rgba(54, 122, 117, 0.1) !important;
}

.tool-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  margin-bottom: 18px;
  border-radius: 13px;
  background: #e5f4f2;
  color: #438c85;
}

.tool-card h3 {
  margin-bottom: 9px;
  color: #315e5a;
  font-size: 17px;
  font-weight: 700;
}

.tool-card p {
  margin-bottom: 20px;
  color: #718b88;
  font-size: 13px;
}

.tool-link {
  display: flex;
  align-items: center;
  gap: 6px;
  color: #438c85;
  font-size: 14px;
  font-weight: 600;
}

/* Mobile */
@media (max-width: 600px) {
  .profile-content {
    padding: 20px;
    gap: 14px;
  }

  .profile-avatar {
    width: 60px !important;
    height: 60px !important;
  }

  .profile-content h3 {
    font-size: 16px;
  }
}
</style>
