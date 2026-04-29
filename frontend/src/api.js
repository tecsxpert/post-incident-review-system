import axios from "axios"

export const API = axios.create({
 baseURL:"http://localhost:8080/api"
})

// RESPONSE INTERCEPTOR
API.interceptors.response.use(
 res => res,
 err => {
  if(err.response){
   alert(err.response.data?.message || "Server Error")
  } else {
   alert("Network Error")
  }
  return Promise.reject(err)
 }
)