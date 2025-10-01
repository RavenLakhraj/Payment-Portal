// Mock data for UI demonstration purposes
export const mockCustomers = [
  {
    id: "1",
    fullName: "John Doe",
    idNumber: "9001015009087",
    accountNumber: "ACC001234567",
    email: "john.doe@email.com",
  },
  {
    id: "2",
    fullName: "Jane Smith",
    idNumber: "8505123456789",
    accountNumber: "ACC987654321",
    email: "jane.smith@email.com",
  },
]

export const mockEmployees = [
  {
    id: "1",
    employeeId: "EMP001",
    fullName: "Alice Johnson",
    department: "International Payments",
    role: "Senior Analyst",
  },
  {
    id: "2",
    employeeId: "EMP002",
    fullName: "Bob Wilson",
    department: "Compliance",
    role: "Manager",
  },
]

export const mockPayments = [
  {
    id: "PAY001",
    customerId: "1",
    customerName: "John Doe",
    amount: 5000.0,
    currency: "USD",
    provider: "SWIFT",
    recipientName: "Global Corp Ltd",
    recipientAccount: "GB29NWBK60161331926819",
    swiftCode: "NWBKGB2L",
    status: "pending",
    createdAt: "2025-01-20T10:30:00Z",
    description: "International business payment",
  },
  {
    id: "PAY002",
    customerId: "2",
    customerName: "Jane Smith",
    amount: 2500.0,
    currency: "EUR",
    provider: "SWIFT",
    recipientName: "European Suppliers",
    recipientAccount: "DE89370400440532013000",
    swiftCode: "COBADEFF",
    status: "verified",
    createdAt: "2025-01-20T09:15:00Z",
    description: "Supplier payment",
  },
  {
    id: "PAY003",
    customerId: "1",
    customerName: "John Doe",
    amount: 1200.0,
    currency: "GBP",
    provider: "SWIFT",
    recipientName: "UK Services Ltd",
    recipientAccount: "GB82WEST12345698765432",
    swiftCode: "WESTGB22",
    status: "submitted",
    createdAt: "2025-01-19T14:45:00Z",
    description: "Service fees",
  },
]

export const currencies = [
  { code: "USD", name: "US Dollar", symbol: "$" },
  { code: "EUR", name: "Euro", symbol: "€" },
  { code: "GBP", name: "British Pound", symbol: "£" },
  { code: "JPY", name: "Japanese Yen", symbol: "¥" },
  { code: "ZAR", name: "South African Rand", symbol: "R" },
  { code: "CHF", name: "Swiss Franc", symbol: "CHF" },
]

export const swiftProviders = [
  { code: "SWIFT", name: "SWIFT Network", description: "Standard international wire transfer" },
  { code: "FEDWIRE", name: "Fedwire", description: "US domestic wire transfer system" },
  { code: "TARGET2", name: "TARGET2", description: "European payment system" },
]
