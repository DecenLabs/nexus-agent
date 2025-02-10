import React from 'react';
import { Search } from 'lucide-react';

export default function SearchBar() {
    return (
        <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
                type="text"
                placeholder="Search tokens..."
                className="w-full pl-12 pr-4 py-3 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
        </div>
    );
} 