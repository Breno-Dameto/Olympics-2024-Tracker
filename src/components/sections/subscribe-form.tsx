import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const SubscribeForm: React.FC = () => {
  const [email, setEmail] = useState<string>('');

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        throw new Error('Error subscribing');
      }

      alert('Subscription successful!');
      setEmail('');
    } catch (error) {
      console.error('Error:', error);
      alert('Subscription failed.');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="flex w-full max-w-sm items-center space-x-2 mt-12 relative z-20">
        <Input 
          type="email" 
          placeholder="you@example.com" 
          className="relative z-20 bg-white border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Button type="submit" className="relative z-20">Subscribe</Button>
      </div>
    </form>
  );
};

export default SubscribeForm;