'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Upload } from 'lucide-react';

// Test data for expenses table
const TEST_EXP_DATA = [
  { id: '1001', tblidx: 1, exp: 100, zenny: 5000, ownerId: 'user_001' },
  { id: '1002', tblidx: 2, exp: 250, zenny: 7500, ownerId: 'user_001' },
  { id: '1003', tblidx: 3, exp: 500, zenny: 12000, ownerId: 'user_002' },
  { id: '1004', tblidx: 4, exp: 750, zenny: 15000, ownerId: 'user_001' },
  { id: '1005', tblidx: 5, exp: 1000, zenny: 20000, ownerId: 'user_002' },
];

// Column definitions for the expenses table
const EXP_COLUMNS = [
  { key: 'id', label: 'ID' },
  { key: 'tblidx', label: 'Table Index' },
  { key: 'exp', label: 'Experience' },
  { key: 'zenny', label: 'Zenny' },
  { key: 'ownerId', label: 'Owner ID' },
];

export default function ExpTablePage() {
  const [data, setData] = useState<any[]>(TEST_EXP_DATA);

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
                  Experience Table
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
                        {EXP_COLUMNS.map((column) => (
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
                          {EXP_COLUMNS.map((column) => (
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