
<template>
  <v-app>
    <div class="login-page">
      <v-card
        class="login-card"
        max-width="400"
        width="100%"
        rounded="xl"
        elevation="0"
      >
        <div class="text-center">
          <div class="logo-icon">
            <v-icon size="32" color="white">
              mdi-account-circle
            </v-icon>
          </div>

          <h2 class="login-title">Welcome Back</h2>
          <p class="login-subtitle">
            Sign in to continue to your account.
          </p>
        </div>

        <v-btn
          block
          height="48"
          rounded="lg"
          variant="outlined"
          class="google-btn mt-8"
          :loading="signingIn"
          :disabled="signingIn"
          @click="loginWithGoogle"
        >
          <v-icon start color="blue">mdi-google</v-icon>
          Continue with Google
        </v-btn>

        <v-alert
          v-if="errorMessage"
          type="error"
          variant="tonal"
          density="compact"
          rounded="lg"
          class="mt-4"
        >
          {{ errorMessage }}
        </v-alert>

        <p class="footer-text text-center mt-8">
          Secure sign-in powered by Google
        </p>
      </v-card>
    </div>
  </v-app>
</template>

<script setup lang="ts">
// @ts-nocheck

definePageMeta({
  layout: false
})

const config = useRuntimeConfig()
const signingIn = ref(false)
const errorMessage = ref('')

declare global {
  interface Window {
    google: any
  }
}

async function loginWithGoogle() {
  errorMessage.value = ''

  if (!window.google?.accounts?.oauth2) {
    errorMessage.value = 'Google Sign-In is unavailable. Please refresh the page.'
    return
  }

  signingIn.value = true

  try {
    const client = window.google.accounts.oauth2.initTokenClient({
      client_id: config.public.googleClientId,
      scope: 'openid email profile',

      callback: async (response: any) => {
        try {
          if (response.error) throw new Error(response.error)

          const userInfo = await $fetch(
            'https://www.googleapis.com/oauth2/v3/userinfo',
            {
              headers: {
                Authorization: `Bearer ${response.access_token}`
              }
            }
          )

          localStorage.setItem('google_user', JSON.stringify(userInfo))
          localStorage.setItem('google_token', response.access_token)

          await navigateTo('/')
        } catch (error) {
          console.error(error)
          errorMessage.value = 'Unable to sign in. Please try again.'
        } finally {
          signingIn.value = false
        }
      }
    })

    client.requestAccessToken()
  } catch (error) {
    console.error(error)
    errorMessage.value = 'Something went wrong. Please try again.'
    signingIn.value = false
  }
}
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  background: #f6f8f7;
}

.login-card {
  padding: 40px 32px;
  background: white;
  border: 1px solid #d8eae7;
}

.logo-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 64px;
  height: 64px;
  margin: 0 auto 22px;
  border-radius: 18px;
  background: #6da9a2;
}

.login-title {
  margin-bottom: 8px;
  color: #315e5a;
  font-size: 26px;
  font-weight: 700;
}

.login-subtitle {
  color: #718b88;
  font-size: 14px;
}

.google-btn {
  color: #367a75;
  border-color: #c8e6e2;
  font-weight: 600;
  letter-spacing: 0;
  text-transform: none;
}

.google-btn:hover {
  background: #e5f4f2;
}

.footer-text {
  color: #8a9e9b;
  font-size: 12px;
}

@media (max-width: 480px) {
  .login-card {
    padding: 32px 22px;
  }
}
</style>
