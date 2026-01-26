import { useMutation } from '@tanstack/react-query'
import { authService } from '../services/authService'
import type { LoginFormData, RegisterFormData } from '../models'

export const useLogin = () => {
  return useMutation({
    mutationFn: (data: LoginFormData) => authService.login(data),
  })
}

export const useRegister = () => {
  return useMutation({
    mutationFn: (data: RegisterFormData) => authService.register(data),
  })
}
