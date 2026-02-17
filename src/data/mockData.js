// Mock data for IoT Smart Locker Vending System
export const adminUser = {
  name: "Sarah Johnson",
  role: "System Administrator"
};

export const systemMetrics = {
  totalLockers: 50,
  availableLockers: 18,
  occupiedLockers: 28,
  expiredRentals: 4
};

export const lockersData = [
  {
    lockerId: "LOC-001",
    status: "Available",
    timeRemaining: "--",
    user: null,
    capacity: "Large"
  },
  {
    lockerId: "LOC-002",
    status: "Occupied",
    timeRemaining: "2 hours 30 minutes",
    user: "John Doe",
    capacity: "Medium"
  },
  {
    lockerId: "LOC-003",
    status: "Occupied",
    timeRemaining: "5 hours 15 minutes",
    user: "Emma Wilson",
    capacity: "Large"
  },
  {
    lockerId: "LOC-004",
    status: "Available",
    timeRemaining: "--",
    user: null,
    capacity: "Small"
  },
  {
    lockerId: "LOC-005",
    status: "Expired",
    timeRemaining: "Overdue by 1 hour",
    user: "Michael Chen",
    capacity: "Medium"
  },
  {
    lockerId: "LOC-006",
    status: "Occupied",
    timeRemaining: "8 hours 45 minutes",
    user: "Lisa Anderson",
    capacity: "Large"
  },
  {
    lockerId: "LOC-007",
    status: "Available",
    timeRemaining: "--",
    user: null,
    capacity: "Small"
  },
  {
    lockerId: "LOC-008",
    status: "Expired",
    timeRemaining: "Overdue by 2 hours 30 minutes",
    user: "David Martinez",
    capacity: "Medium"
  }
];

export const notificationsData = [
  {
    id: 1,
    message: "LOC-005 rental expired - Item available for pickup",
    timestamp: "5 minutes ago",
    type: "warning"
  },
  {
    id: 2,
    message: "System maintenance scheduled for tonight at 11:00 PM",
    timestamp: "1 hour ago",
    type: "info"
  },
  {
    id: 3,
    message: "Stock alert: Small lockers running low on availability",
    timestamp: "3 hours ago",
    type: "alert"
  },
  {
    id: 4,
    message: "LOC-008 rental expired - Item available for pickup",
    timestamp: "Yesterday",
    type: "warning"
  },
  {
    id: 5,
    message: "System online - All sensors functioning normally",
    timestamp: "Yesterday",
    type: "success"
  }
];

export const systemStatus = "System Status: Online • All Units Operational • Last Checked: 2 minutes ago";
