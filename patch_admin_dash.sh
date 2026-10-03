#!/bin/bash
sed -i "s/{currentView === 'manage-users' && <AdminManageUsers \/>}/{currentView === 'manage-users' \&\& <AdminManageUsers onManageUser={(id) => { setActiveUserId(id); setIsUserModalOpen(true); }} \/>}/g" src/components/AdminDashboard.tsx
