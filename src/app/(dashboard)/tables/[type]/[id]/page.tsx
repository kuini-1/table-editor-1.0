'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Upload } from 'lucide-react';

// Test data for expenses table
const TEST_EXP_DATA = [
  { id: '1001', tblidx: 1, exp: 100, zenny: 5000, ownerId: 'user_001' },
  { id: '1002', tblidx: 2, exp: 250, zenny: 7500, ownerId: 'user_001' },
  { id: '1003', tblidx: 3, exp: 500, zenny: 12000, ownerId: 'user_002' },
  { id: '1004', tblidx: 4, exp: 750, zenny: 15000, ownerId: 'user_001' },
  { id: '1005', tblidx: 5, exp: 1000, zenny: 20000, ownerId: 'user_002' },
  { id: '1006', tblidx: 6, exp: 1500, zenny: 25000, ownerId: 'user_001' },
  { id: '1007', tblidx: 7, exp: 2000, zenny: 30000, ownerId: 'user_002' },
  { id: '1008', tblidx: 8, exp: 2500, zenny: 35000, ownerId: 'user_001' },
  { id: '1009', tblidx: 9, exp: 3000, zenny: 40000, ownerId: 'user_002' },
  { id: '1010', tblidx: 10, exp: 5000, zenny: 50000, ownerId: 'user_001' },
];

export default function TableDetailPage() {
  const params = useParams();
  const { type, id } = params;
  const [data, setData] = useState<any[]>(type === 'exp' ? TEST_EXP_DATA : []);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      // For now, just read the file as text
      const text = await file.text();
      // Assuming CSV format, split by newlines and commas
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
                  Table Details
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
                    accept=".csv,.xlsx,.xls"
                    className="hidden"
                    onChange={handleFileUpload}
                  />
                </div>
              </div>
              <div className="mt-2">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Type: {type} | ID: {id}
                </p>
              </div>
            </div>

            <div className="p-6">
              {data.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                      <tr>
                        {Object.keys(data[0]).map((header) => (
                          <th
                            key={header}
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                          >
                            {header}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                      {data.map((row, rowIndex) => (
                        <tr key={rowIndex} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                          {Object.values(row).map((value: any, colIndex) => (
                            <td
                              key={colIndex}
                              className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white"
                            >
                              {value}
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