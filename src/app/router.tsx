import { createBrowserRouter, Navigate } from 'react-router-dom'
import { AuthGuard, RoleGuard, GuestGuard } from './guards'
import {
  AdminLayout,
  OwnerLayout,
  EmployeeLayout,
  ClientLayout,
} from './layouts'
import { UserRole } from '@shared/types'

// Auth Feature
import { Auth } from '@features/auth/auth'

// Admin Feature
import { Admin } from '@features/admin/admin'
import { CreateOwner } from '@features/admin/components/CreateOwnerForm'
import { CreateRestaurant } from '@features/admin/components/CreateRestaurantForm'

// Owner Feature
import { Owner } from '@features/owner/owner'
import { DishesManager } from '@features/owner/components/DishesTable'
import { DishForm } from '@features/owner/components/DishForm'
import { CreateEmployee } from '@features/owner/components/CreateEmployeeForm'
import { OwnerAnalytics } from '@features/owner/components/EfficiencyReport'

// Employee Feature
import { Employee } from '@features/employee/employee'

// Client Feature
import { Client } from '@features/client/client'
import { RestaurantMenu } from '@features/client/components/RestaurantMenu'
import { ShoppingCart } from '@features/client/components/ShoppingCart'
import { MyOrders } from '@features/client/components/MyOrders'

// Pages
import { NotFound } from './pages/NotFound'

export const router = createBrowserRouter([
  // Root redirect
  {
    path: '/',
    element: <Navigate to="/login" replace />,
  },

  // Auth routes (Guest only)
  {
    path: '/login',
    element: (
      <GuestGuard>
        <Auth mode="login" />
      </GuestGuard>
    ),
  },
  {
    path: '/register',
    element: (
      <GuestGuard>
        <Auth mode="register" />
      </GuestGuard>
    ),
  },

  // Admin routes
  {
    path: '/admin',
    element: (
      <AuthGuard>
        <RoleGuard allowedRoles={[UserRole.ADMINISTRADOR]}>
          <AdminLayout />
        </RoleGuard>
      </AuthGuard>
    ),
    children: [
      {
        index: true,
        element: <Navigate to="/admin/dashboard" replace />,
      },
      {
        path: 'dashboard',
        element: <Admin />,
      },
      {
        path: 'create-owner',
        element: <CreateOwner />,
      },
      {
        path: 'create-restaurant',
        element: <CreateRestaurant />,
      },
    ],
  },

  // Owner routes
  {
    path: '/owner',
    element: (
      <AuthGuard>
        <RoleGuard allowedRoles={[UserRole.PROPIETARIO]}>
          <OwnerLayout />
        </RoleGuard>
      </AuthGuard>
    ),
    children: [
      {
        index: true,
        element: <Navigate to="/owner/dashboard" replace />,
      },
      {
        path: 'dashboard',
        element: <Owner />,
      },
      {
        path: 'dishes',
        element: <DishesManager />,
      },
      {
        path: 'dish/create',
        element: <DishForm mode="create" />,
      },
      {
        path: 'dish/edit/:id',
        element: <DishForm mode="edit" />,
      },
      {
        path: 'create-employee',
        element: <CreateEmployee />,
      },
      {
        path: 'analytics',
        element: <OwnerAnalytics />,
      },
    ],
  },

  // Employee routes
  {
    path: '/employee',
    element: (
      <AuthGuard>
        <RoleGuard allowedRoles={[UserRole.EMPLEADO]}>
          <EmployeeLayout />
        </RoleGuard>
      </AuthGuard>
    ),
    children: [
      {
        index: true,
        element: <Navigate to="/employee/orders" replace />,
      },
      {
        path: 'orders',
        element: <Employee />,
      },
    ],
  },

  // Client routes
  {
    path: '/client',
    element: (
      <AuthGuard>
        <RoleGuard allowedRoles={[UserRole.CLIENTE]}>
          <ClientLayout />
        </RoleGuard>
      </AuthGuard>
    ),
    children: [
      {
        index: true,
        element: <Navigate to="/client/restaurants" replace />,
      },
      {
        path: 'restaurants',
        element: <Client />,
      },
      {
        path: 'restaurant/:id',
        element: <RestaurantMenu />,
      },
      {
        path: 'cart',
        element: <ShoppingCart />,
      },
      {
        path: 'orders',
        element: <MyOrders />,
      },
    ],
  },

  // 404 Not Found
  {
    path: '*',
    element: <NotFound />,
  },
])
