# Architecture & Design Document

## Overview
A full-stack food ordering web application with Role-Based Access Control (RBAC) and country-based relational access.

---

## System Architecture

```
Browser (Next.js :3000)
        │
        │  HTTP + JWT
        ▼
NestJS API (:3001)
        │
        │  TypeORM
        ▼
SQLite (restaurant.db)
```

---

## Backend Module Design (NestJS)

```
src/
├── auth/           JWT login, Passport strategy
├── users/          User entity, UsersService
├── restaurants/    Restaurant + MenuItem entities, country-filtered queries
├── orders/         Order CRUD, place/cancel with RBAC + country checks
├── payments/       PaymentMethod CRUD, admin-only update/delete
├── common/         RolesGuard, enums (Role, Country, OrderStatus)
└── seed.service.ts Auto-seeds DB on first boot
```

### Key Design Decisions
- **JWT Auth**: Stateless, token carries `role` and `country` — no DB lookup on every request
- **RBAC via Guard**: `RolesGuard` reads `@Roles()` decorator metadata, throws 403 if role insufficient
- **Country Filtering**: Done at service layer — Admin bypasses, Manager/Member get filtered queries
- **SQLite + TypeORM**: File-based DB, zero setup, `synchronize: true` auto-creates schema

---

## Frontend Module Design (Next.js App Router)

```
app/
├── login/          Login form with quick-fill buttons for all 6 users
├── restaurants/    Browse restaurants, add to cart, place order
├── orders/         View orders, place/cancel (role-gated UI)
└── payments/       View/edit/delete payment methods (admin-only edit UI)

lib/
├── api.ts          Axios instance — auto-attaches JWT from cookie
└── auth.tsx        React context — login/logout/user state via cookies
```

### Key Design Decisions
- **Auth Context**: User + token stored in cookies (1 day expiry), restored on page refresh
- **Role-gated UI**: Buttons like "Place & Pay" and "Cancel" only render for Admin/Manager
- **Cart**: Single-restaurant cart with quantity controls, clears on restaurant switch

---

## Database Schema

### User
| Column   | Type   | Notes                  |
|----------|--------|------------------------|
| id       | int PK |                        |
| username | string | unique                 |
| password | string | bcrypt hashed          |
| name     | string |                        |
| role     | enum   | admin/manager/member   |
| country  | enum   | india/america          |

### Restaurant
| Column  | Type   | Notes          |
|---------|--------|----------------|
| id      | int PK |                |
| name    | string |                |
| cuisine | string |                |
| country | enum   | india/america  |
| address | string |                |

### MenuItem
| Column     | Type    | Notes                    |
|------------|---------|--------------------------|
| id         | int PK  |                          |
| name       | string  |                          |
| price      | decimal |                          |
| category   | string  |                          |
| available  | boolean |                          |
| restaurant | FK      | → Restaurant             |

### Order
| Column     | Type        | Notes                        |
|------------|-------------|------------------------------|
| id         | int PK      |                              |
| user       | FK          | → User                       |
| restaurant | FK          | → Restaurant                 |
| items      | simple-json | [{name, price, qty}]         |
| total      | decimal     |                              |
| status     | enum        | pending/placed/cancelled     |
| country    | enum        | india/america                |
| createdAt  | datetime    |                              |

### PaymentMethod
| Column    | Type    | Notes              |
|-----------|---------|--------------------|
| id        | int PK  |                    |
| user      | FK      | → User             |
| type      | string  | card/upi/wallet    |
| label     | string  | display name       |
| isDefault | boolean |                    |

---

## RBAC Matrix

| Function                 | Admin | Manager | Member |
|--------------------------|-------|---------|--------|
| View restaurants & menu  | ✅    | ✅      | ✅     |
| Create order             | ✅    | ✅      | ✅     |
| Place order (checkout)   | ✅    | ✅      | ❌     |
| Cancel order             | ✅    | ✅      | ❌     |
| Update payment method    | ✅    | ❌      | ❌     |

## Country-Based Relational Access (Bonus)

| User            | Role    | Country | Can See              |
|-----------------|---------|---------|----------------------|
| Nick Fury       | Admin   | America | All countries        |
| Captain Marvel  | Manager | India   | India only           |
| Captain America | Manager | America | America only         |
| Thanos          | Member  | India   | India only           |
| Thor            | Member  | India   | India only           |
| Travis          | Member  | America | America only         |

---

## Seed Data

### Restaurants
| Name          | Country | Cuisine          |
|---------------|---------|------------------|
| Spice Garden  | India   | Indian           |
| Curry House   | India   | Indian           |
| Burger Barn   | America | American         |
| Pizza Palace  | America | Italian-American |

### Menu Items (3 per restaurant = 12 total)
| Restaurant   | Items                                      |
|--------------|--------------------------------------------|
| Spice Garden | Butter Chicken, Paneer Tikka, Garlic Naan  |
| Curry House  | Dal Makhani, Samosa, Mango Lassi           |
| Burger Barn  | Classic Burger, Cheese Fries, Milkshake    |
| Pizza Palace | Margherita Pizza, Caesar Salad, Tiramisu   |
