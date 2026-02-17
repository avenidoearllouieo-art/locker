// Mock data for IoT Smart Locker Vending System
export const adminUser = {
  name: "Ramiro",
  role: "System Administrator"
};

export const systemMetrics = {
  totalLockers: 8,
  availableLockers: 3,
  occupiedLockers: 3,
  expiredRentals: 2
};

export const lockersData = [
  {
    lockerId: "LOC-001",
    status: "Available",
    timeRemaining: "--",
    user: null,
  },
  {
    lockerId: "LOC-002",
    status: "Occupied",
    timeRemaining: "2 hours 30 minutes",
    user: "Chrsitian Ramiro",
  },
  {
    lockerId: "LOC-003",
    status: "Occupied",
    timeRemaining: "5 hours 15 minutes",
    user: "Earl avenido",
  },
  {
    lockerId: "LOC-004",
    status: "Available",
    timeRemaining: "--",
    user: null,
  },
  {
    lockerId: "LOC-005",
    status: "Expired",
    timeRemaining: "Overdue by 1 hour",
    user: "Kurt bagares",
  },
  {
    lockerId: "LOC-006",
    status: "Occupied",
    timeRemaining: "8 hours 45 minutes",
    user: "Ryan Paderanga",
  },
  {
    lockerId: "LOC-007",
    status: "Available",
    timeRemaining: "--",
    user: null,
  },
  {
    lockerId: "LOC-008",
    status: "Expired",
    timeRemaining: "Overdue by 2 hours 30 minutes",
    user: "Shelly bulanon",
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
