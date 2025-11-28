import React from 'react'

/**
 * Common TypeScript types for Brutalist Components
 */

export type ButtonVariant =
  | 'primary'
  | 'success'
  | 'danger'
  | 'warning'
  | 'neutral'

export type ButtonSize = 'sm' | 'md' | 'lg'

export type InputType =
  | 'text'
  | 'email'
  | 'password'
  | 'number'
  | 'date'
  | 'url'
  | 'tel'

export type ModalSize = 'sm' | 'md' | 'lg'

export type SpinnerSize = 'sm' | 'md' | 'lg'

export interface SelectOption {
  label: string
  value: string
}

export interface TableColumn<T> {
  key: keyof T
  label: string
  render?: (value: T[keyof T], row: T) => React.ReactNode
}

export type AlertType = 'success' | 'error' | 'warning' | 'info'
