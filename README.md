**  **
Cafeteria is a full-stack Laravel + React web application that allows users to track, manage, and visualize daily expenses. 
---

## Core Features

- Record daily cup/product deliveries from vendors
- Track credits, debits, and balances per vendor
- Generate transaction history and payment logs
- Admin authentication with role-based access
- Export-ready design for reports (future support for PDF/Excel)
- Responsive frontend using React + Inertia.js

## Main Database Tables & Relationships

- `users`: Authenticated users (admin, others)
- `vendors`: Vendor list with GST, contact, balance
- `products`: Each vendor’s offered cups/products
- `cup_list_master` + `cup_list_details`: Cup delivery records
- `transactions`: Tracks all credit/debit entries per vendor
- `payments`: Manual payments to/from vendors
- `profile_images`: Uploads for user profiles

## Authentication & Access

- Laravel Sanctum is used for token-based auth
- Admin-only routes are protected using middleware
- Role field (`role`) is checked before sensitive actions
- Passwords are securely hashed using `bcrypt`

## Development Note


- We encountered configuration issues on multiple machines          during development.
- To ensure the project worked smoothly, we tested it on several PCs.
- Because of these setup issues, we created a new GitHub repository.
The source code was copied from the original repository, so functionality is the same, but the commit history does not reflect the entire development process.

