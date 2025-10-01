import Link from 'next/link';
import { Shield } from 'lucide-react';

// Home page: landing page for AdAstra Bank
// - gives users quick links to Customer or Employee login
// - points users to registration for new accounts
export default function Home() {
	return (
		<div className="min-h-screen flex flex-col items-center justify-center bg-background p-4">
			{/* Brand header */}
			<div className="flex items-center mb-6">
				<Shield className="h-8 w-8 text-primary mr-2" style={{color:'var(--primary)'}} />
				<h1 className="text-3xl font-bold text-foreground">Welcome to AdAstra Bank Portal</h1>
			</div>
			{/* Quick action links */}
			<div className="space-x-4">
				<Link href="/employee/login" className="px-6 py-3 rounded text-on-accent" style={{backgroundColor:'var(--primary)'}}>Employee Login</Link>
				<Link href="/customer/login" className="px-6 py-3 rounded text-on-accent" style={{backgroundColor:'var(--accent)'}}>Customer Login</Link>
			</div>
			{/* Short description */}
			<div className="mt-8 text-muted-foreground text-center text-sm max-w-md">
				<p>AdAstra Bank provides a secure portal for employees and customers to manage accounts and payments. Please select your login type above or register for a new account.</p>
			</div>
		</div>
	);
}
