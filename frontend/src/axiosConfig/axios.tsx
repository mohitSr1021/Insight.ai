import { message } from "antd"
import axios, { type InternalAxiosRequestConfig, type AxiosResponse, type AxiosError } from "axios"

type TimeoutId = ReturnType<typeof setTimeout>
type MessageType = ReturnType<typeof message.loading>

interface CustomInternalAxiosRequestConfig extends InternalAxiosRequestConfig {
  timeoutWarning?: TimeoutId
  controller?: AbortController
  requestId?: string
}

const axiosInstance = axios.create({
  baseURL: `${import.meta.env.VITE_INSIGHT_BACKEND}/api/${import.meta.env.VITE_API_VERSION}`,
  timeout: 30000,
})

let warningDisplayed = false
let warningMessage: MessageType | null = null

// Map to store pending requests
const pendingRequests = new Map<string, AbortController>()

// Generate a unique request identifier based on method and URL
const getRequestId = (config: InternalAxiosRequestConfig): string => {
  return `${config.method || ''}:${config.url || ''}`
}

// Cancel previous requests with the same ID
const cancelPreviousRequests = (requestId: string, controller: AbortController): void => {
  if (pendingRequests.has(requestId)) {
    const previousController = pendingRequests.get(requestId)
    if (previousController) {
      previousController.abort()
      console.log(`Cancelled previous request: ${requestId}`)
    }
  }
  pendingRequests.set(requestId, controller)
}

axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
    const token = localStorage.getItem("token")
    if (token) {
      config.headers = config.headers || {}
      config.headers.Authorization = `Bearer ${token}`
    }

    const customConfig = config as CustomInternalAxiosRequestConfig

    // Set up timeout warning
    customConfig.timeoutWarning = setTimeout(() => {
      if (!warningDisplayed) {
        warningDisplayed = true
        warningMessage = message.loading(
          "This request is taking longer than usual (15-20 seconds expected). Please wait...",
          0,
        )
      }
    }, 10000)

    // Set up request cancellation
    const controller = new AbortController()
    customConfig.controller = controller
    customConfig.signal = controller.signal

    // Generate request ID and cancel previous requests to the same endpoint
    const requestId = getRequestId(config)
    customConfig.requestId = requestId
    cancelPreviousRequests(requestId, controller)

    config.timeout = 20000
    return config
  },
  (error: AxiosError) => Promise.reject(error),
)

axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => {
    const config = response.config as CustomInternalAxiosRequestConfig

    // Clear timeout warning
    if (config.timeoutWarning) {
      clearTimeout(config.timeoutWarning)
    }
    if (warningDisplayed && warningMessage) {
      warningMessage()
      warningDisplayed = false
      warningMessage = null
    }

    // Remove from pending requests map
    if (config.requestId) {
      pendingRequests.delete(config.requestId)
    }

    return response
  },
  (error: AxiosError<{ error: string } | undefined> | any) => {
    const config = error.config as CustomInternalAxiosRequestConfig | undefined

    // Clear timeout warning
    if (config?.timeoutWarning) {
      clearTimeout(config.timeoutWarning)
      if (warningDisplayed && warningMessage) {
        warningMessage()
        warningDisplayed = false
        warningMessage = null
      }
    }

    // Remove from pending requests map if not canceled
    if (config?.requestId && !axios.isCancel(error)) {
      pendingRequests.delete(config.requestId)
    }

    // Don't show error messages for canceled requests
    if (axios.isCancel(error)) {
      console.log("Request canceled:", error.message)
      return Promise.reject(error)
    }

    if (error.response) {
      const responseData = error.response.data as { error?: string } | undefined
      if (error.response.status === 401 && responseData?.error === "Token has expired, please log in again") {
        message.loading(`Token has expired, Redirecting to the login page....`, 4)
        setTimeout(() => {
          localStorage.clear()
          window.location.href = "/auth"
        }, 4000)
      } else {
        console.error("Error Response:", error.response)
      }
    } else if ((error as AxiosError).request) {
      console.error("No response received:", (error as AxiosError).request)
    } else {
      console.error("Axios error:", (error as AxiosError).message)
    }
    return Promise.reject(error)
  },
)

export default axiosInstance