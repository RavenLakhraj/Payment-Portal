// ...existing code...
import React from "react";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Button } from "../../components/ui/button";

export default function login() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        <Card className="border-2">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Customer Portal</CardTitle>
            <CardDescription>Login to access your account and make payments</CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="customerId">Customer ID</Label>
                <Input id="customerId" name="customerId" type="text" placeholder="CUST123456" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" name="password" type="password" placeholder="Enter your password" required />
              </div>
              <Button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white">Login</Button>
            </form>
            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                {"Are you an employee? "}
                <Link href="/employee/login" className="text-primary hover:underline">
                  Employee Login
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
