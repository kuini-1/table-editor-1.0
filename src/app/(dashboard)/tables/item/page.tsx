'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Upload } from 'lucide-react';

// Test data for item table
const TEST_ITEM_DATA = [
  { id: '3001', name: 'Health Potion', type: 'Consumable', value: 100, rarity: 'Common', weight: 0.5 },
  { id: '3002', name: 'Iron Sword', type: 'Weapon', value: 500, rarity: 'Common', weight: 3.0 },
  { id: '3003', name: 'Magic Ring', type: 'Accessory', value: 1000, rarity: 'Rare', weight: 0.1 },
  { id: '3004', name: 'Dragon Scale', type: 'Material', value: 2000, rarity: 'Epic', weight: 1.0 },
  { id: '3005', name: 'Ancient Scroll', type: 'Quest', value: 5000, rarity: 'Legendary', weight: 0.2 },
];

// Column definitions for the item table
const ITEM_COLUMNS = [
  { key: 'id', label: 'ID' },
  { key: 'name', label: 'Name' },
  { key: 'type', label: 'Type' },
  { key: 'value', label: 'Value' },
  { key: 'rarity', label: 'Rarity' },
  { key: 'weight', label: 'Weight' },
];

export default function ItemTablePage() {
  const [data, setData] = useState<any[]>(TEST_ITEM_DATA);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      const rows = text.split('\n');
      const headers = rows[0].split(',');
      const parsedData = rows.slice(1).map(row => {
        const values = row.split(',');
        return headers.reduce((obj, header, index) => {
          obj[header.trim()] = values[index]?.trim();
          return obj;
        }, {} as any);
      });

      setData(parsedData);
    } catch (error) {
      console.error('Error reading file:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Item Table
                </h2>
                <div className="flex items-center space-x-4">
                  <Button
                    variant="outline"
                    onClick={() => document.getElementById('file-upload')?.click()}
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Import Data
                  </Button>
                  <input
                    id="file-upload"
                    type="file"
                    accept=".csv"
                    className="hidden"
                    onChange={handleFileUpload}
                  />
                </div>
              </div>
            </div>

            <div className="p-6">
              {data.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                      <tr>
                        {ITEM_COLUMNS.map((column) => (
                          <th
                            key={column.key}
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                          >
                            {column.label}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                      {data.map((row, rowIndex) => (
                        <tr key={rowIndex} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                          {ITEM_COLUMNS.map((column) => (
                            <td
                              key={column.key}
                              className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white"
                            >
                              {row[column.key]}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-12">
                  <Upload className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No data</h3>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    Get started by importing a file
                  </p>
                  <div className="mt-6">
                    <Button
                      variant="outline"
                      onClick={() => document.getElementById('file-upload')?.click()}
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      Import Data
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 