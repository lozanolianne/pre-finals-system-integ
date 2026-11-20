
<template>
  <div class="qr-page">
    <p class="page-description">
      Point your camera at a QR code to scan it instantly.
    </p>

    <v-row>
      <!-- Camera Scanner -->
      <v-col cols="12" lg="7">
        <v-card class="scanner-card" rounded="xl" elevation="0">
          <div class="card-heading">
            <div>
              <h3>Camera View</h3>
              <p>Start the scanner to activate your camera.</p>
            </div>

            <v-chip :color="isScanning ? 'success' : 'grey'" size="small">
              {{ isScanning ? 'Active' : 'Inactive' }}
            </v-chip>
          </div>

          <div class="camera-container">
            <video ref="videoRef" playsinline muted></video>

            <div v-if="!isScanning" class="camera-placeholder">
              <v-icon size="45">mdi-camera-outline</v-icon>
              <h4>Camera preview</h4>
              <p>Allow camera access to start scanning.</p>
            </div>

            <div v-if="isScanning" class="scanning-label">
              <v-icon color="success" size="small">mdi-circle</v-icon>
              Scanning...
            </div>
          </div>

          <v-alert v-if="errorMessage" type="error" variant="tonal" class="mt-4">
            {{ errorMessage }}
          </v-alert>

          <div class="scanner-actions">
            <v-btn
              class="start-button"
              :loading="starting"
              :disabled="isScanning || starting"
              @click="startScanner"
            >
              <v-icon start>mdi-camera</v-icon>
              Start Scanner
            </v-btn>

            <v-btn
              class="stop-button"
              variant="outlined"
              :disabled="!isScanning"
              @click="stopScanner"
            >
              <v-icon start>mdi-stop-circle-outline</v-icon>
              Stop
            </v-btn>
          </div>
        </v-card>
      </v-col>

      <!-- Scan Result -->
      <v-col cols="12" lg="5">
        <v-card class="result-card" rounded="xl" elevation="0">
          <div class="card-heading">
            <div>
              <h3>Scan Result</h3>
              <p>Your latest QR code content</p>
            </div>

            <v-icon size="28" class="result-icon">
              mdi-text-box-check-outline
            </v-icon>
          </div>

          <div class="result-content">
            {{ result || 'No QR code scanned yet.' }}
          </div>

          <v-btn
            block
            class="copy-button"
            :disabled="!result"
            @click="copyResult"
          >
            <v-icon start>
              {{ copied ? 'mdi-check-circle' : 'mdi-content-copy' }}
            </v-icon>
            {{ copied ? 'Copied!' : 'Copy Result' }}
          </v-btn>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script setup lang="ts">
import QrScanner from 'qr-scanner'

const videoRef = ref<HTMLVideoElement | null>(null)

const result = ref('')
const copied = ref(false)
const isScanning = ref(false)
const starting = ref(false)
const errorMessage = ref('')

let scanner: QrScanner | null = null
let copyTimeout: ReturnType<typeof setTimeout> | null = null

async function startScanner() {
  if (!videoRef.value || starting.value || isScanning.value) return

  starting.value = true
  errorMessage.value = ''

  try {
    if (!scanner) {
      scanner = new QrScanner(
        videoRef.value,
        (scanResult) => {
          result.value = scanResult.data
          stopScanner()
        },
        { preferredCamera: 'environment' }
      )
    }

    await scanner.start()
    isScanning.value = true
  } catch (error) {
    console.error(error)
    errorMessage.value = 'Unable to access camera. Please allow camera permission.'
  } finally {
    starting.value = false
  }
}

function stopScanner() {
  scanner?.stop()
  isScanning.value = false
}

async function copyResult() {
  if (!result.value) return

  try {
    await navigator.clipboard.writeText(result.value)
    copied.value = true

    if (copyTimeout) clearTimeout(copyTimeout)

    copyTimeout = setTimeout(() => {
      copied.value = false
    }, 2000)
  } catch (error) {
    console.error(error)
    errorMessage.value = 'Unable to copy the result.'
  }
}

onBeforeUnmount(() => {
  scanner?.destroy()
  scanner = null

  if (copyTimeout) clearTimeout(copyTimeout)
})
</script>

<style scoped>
.qr-page {
  width: 100%;
  max-width: 1100px;
  margin: auto;
  padding: 15px;
}

.page-description {
  margin-bottom: 20px;
  color: #718b88;
  font-size: 14px;
}

/* Cards */
.scanner-card,
.result-card {
  padding: 22px;
  background: white;
  border: 1px solid #d8eae7;
  margin-bottom: 16px;
}

.result-card {
  margin-top: 18px;
}

.card-heading {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
}

.card-heading h3 {
  color: #315e5a;
  font-size: 16px;
  font-weight: 700;
}

.card-heading p {
  margin-top: 5px;
  color: #718b88;
  font-size: 12px;
}

/* Camera */
.camera-container {
  position: relative;
  height: 350px;
  overflow: hidden;
  border-radius: 15px;
  background: #263d3b;
}

.camera-container video {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.camera-placeholder {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: white;
  text-align: center;
  background: #263d3b;
  pointer-events: none;
}

.camera-placeholder .v-icon {
  color: #9bcac4;
}

.camera-placeholder h4 {
  margin-top: 15px;
  font-size: 14px;
}

.camera-placeholder p {
  margin-top: 5px;
  color: #b8cfcc;
  font-size: 11px;
}

.scanning-label {
  position: absolute;
  top: 15px;
  left: 15px;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  border-radius: 20px;
  background: #263d3b;
  color: white;
  font-size: 12px;
}

/* Buttons */
.scanner-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 18px;
}

.start-button,
.copy-button {
  background: #438c85 !important;
  color: white !important;
}

.stop-button {
  color: #438c85 !important;
  border-color: #9bcac4 !important;
}

.scanner-actions .v-btn,
.result-card .v-btn {
  text-transform: none;
  font-weight: 600;
}

/* Result */
.result-icon {
  color: #438c85;
}

.result-content {
  min-height: 100px;
  max-height: 180px;
  overflow-y: auto;
  overflow-wrap: anywhere;
  white-space: pre-wrap;
  padding: 15px;
  margin-bottom: 15px;
  border: 1px solid #d8eae7;
  border-radius: 12px;
  background: #f0f8f7;
  color: #315e5a;
  font-size: 12px;
  line-height: 1.7;
}

.copy-button:disabled {
  background: #e8f2f1 !important;
  color: #a5c5c1 !important;
}

/* Mobile */
@media (max-width: 600px) {
  .camera-container {
    height: 280px;
  }

  .result-card {
    margin-top: 0;
  }

  .scanner-actions {
    flex-direction: column;
  }

  .scanner-actions .v-btn {
    width: 100%;
  }
}
</style>
