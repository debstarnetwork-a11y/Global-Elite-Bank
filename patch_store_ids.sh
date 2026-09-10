#!/bin/bash
sed -i 's/id: `user-${Date.now()}`/id: `user-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`/g' src/store.tsx
sed -i 's/id: `app-${Date.now()}`/id: `app-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`/g' src/store.tsx
sed -i 's/id: `card-${Date.now()}`/id: `card-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`/g' src/store.tsx
sed -i 's/id: `loan-${Date.now()}`/id: `loan-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`/g' src/store.tsx
sed -i 's/id: `acc-${Date.now()}`/id: `acc-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`/g' src/store.tsx
sed -i 's/id: `grant-${Date.now()}`/id: `grant-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`/g' src/store.tsx
sed -i 's/id: `inquiry-${Date.now()}`/id: `inquiry-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`/g' src/store.tsx
sed -i 's/id: `txn-${Date.now()}`/id: `txn-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`/g' src/store.tsx
