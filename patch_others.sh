#!/bin/bash
sed -i 's/id: `acc-${Date.now()}`/id: `acc-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`/g' src/components/AdminModules.tsx
sed -i 's/id: `acc-${Date.now()}`/id: `acc-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`/g' src/components/AdminDashboard.tsx
