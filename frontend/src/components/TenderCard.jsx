import React from 'react';
import { Card, CardContent, CardHeader, CardFooter } from './Card';
import Button from './Button';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';

export default function TenderCard({ tender }) {
  const { _id, title, category, budget, deadline, city } = tender;

  return (
    <Card className="shadow-md hover:shadow-lg transition-all duration-300 border border-gray-200 hover:border-blue-400">
      <CardHeader>
        <h3 className="text-xl font-semibold text-gray-800 truncate" title={title}>
          {title}
        </h3>
        <p className="text-sm text-gray-500 mt-1">{category.charAt(0).toUpperCase() + category.slice(1)} • {city}</p>
      </CardHeader>

      <CardContent className="py-2 space-y-2">
        <p className="text-gray-700">
          <span className="font-medium text-gray-800">Budget:</span> ₹{budget.toLocaleString('en-IN')}
        </p>
        <p className="text-gray-700">
          <span className="font-medium text-gray-800">Deadline:</span> {format(new Date(deadline), 'dd MMM yyyy')}
        </p>
      </CardContent>

      <CardFooter className="flex justify-end">
        <Link to={`/tenders/${_id}`} className="w-full text-right"><Button variant="outline" asChild className="hover:bg-blue-100 hover:text-blue-700 transition">View Details</Button></Link>
      </CardFooter>
    </Card>
  );
}
