#!/bin/bash
sed -i 's/export function AdminManageUsers() {/export function AdminManageUsers({ onManageUser }: { onManageUser?: (id: string) => void }) {/g' src/components/AdminModules.tsx
sed -i 's/<button className="text-primary hover:text-primary\/80 font-bold text-sm">Manage<\/button>/<button onClick={() => onManageUser \&\& onManageUser(client.id)} className="text-primary hover:text-primary\/80 font-bold text-sm">Manage<\/button>/g' src/components/AdminModules.tsx
