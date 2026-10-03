#!/bin/bash
sed -i 's/FileText, CheckCircle, XCircle, Search, Clock, ShieldAlert, CreditCard/FileText, CheckCircle, XCircle, Search, Clock, ShieldAlert, CreditCard, Edit/g' src/components/AdminModules.tsx
sed -i 's/<CheckCircle size={16} \/><\/button>/<Edit size={16} \/><\/button>/g' src/components/AdminModules.tsx
sed -i 's/title="Approve"/title="Edit & Provision"/g' src/components/AdminModules.tsx
sed -i 's/Approve & Provision/Save\/Update \& Open Account/g' src/components/AdminModules.tsx
