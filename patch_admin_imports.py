with open('src/components/AdminDashboard.tsx', 'r') as f:
    content = f.read()

old_imports = """import {
  Users, Activity, ShieldAlert, ArrowUpRight, ArrowDownLeft,
  Search, Filter, MoreHorizontal, CheckCircle, AlertTriangle,
  Settings, Download, ChevronRight, ChevronLeft, Lock, Mail, X, Upload
} from 'lucide-react';"""

new_imports = """import {
  Users, Activity, ShieldAlert, ArrowUpRight, ArrowDownLeft,
  Search, Filter, MoreHorizontal, CheckCircle, AlertTriangle,
  Settings, Download, ChevronRight, ChevronLeft, Lock, Mail, X, Upload,
  UserPlus, FileText, FilePlus, Repeat, Clock, CreditCard, Menu, Image as ImageIcon, Save, Plus, Trash
} from 'lucide-react';"""

content = content.replace(old_imports, new_imports)

with open('src/components/AdminDashboard.tsx', 'w') as f:
    f.write(content)
