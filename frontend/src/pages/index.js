import Link from 'next/link';
import { Shield } from 'lucide-react';

export default function Home() {
	return (
		<div className="min-h-screen flex flex-col items-center justify-center bg-background p-4">
			<div className="flex items-center mb-6">
				<Shield className="h-8 w-8 text-primary mr-2" />
				<h1 className="text-3xl font-bold text-foreground">Welcome to SecureBank Portal</h1>
			</div>
			<div className="space-x-4">
				<Link href="/employee/login" className="px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700">Employee Login</Link>
				<Link href="/customer/login" className="px-6 py-3 bg-green-600 text-white rounded hover:bg-green-700">Customer Login</Link>
			</div>
			<div className="mt-8 text-muted-foreground text-center text-sm max-w-md">
				<p>SecureBank provides a secure portal for employees and customers to manage accounts and payments. Please select your login type above.</p>
			</div>
		</div>
	);
}
