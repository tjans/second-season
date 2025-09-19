import React from 'react';
import Button from '@/components/Elements/Button';
import { Link } from 'react-router-dom';

const ColorTest: React.FC = () => {
  return (
    <div className="p-8 max-w-4xl mx-auto">
      {/* Navigation */}
      <div className="mb-6 p-4 bg-blue-50 rounded-lg">
        <h3 className="text-lg font-semibold mb-2">Style Demos</h3>
        <div className="flex gap-4">
          <Link to="/styles/buttons" className="text-blue-600 hover:text-blue-800 underline">
            Button Components
          </Link>
          <Link to="/styles/links" className="text-blue-600 hover:text-blue-800 underline">
            Link Components
          </Link>
          <span className="font-semibold text-gray-800">Color Test (Current)</span>
        </div>
      </div>

      <h1 className="text-2xl font-bold mb-8">Button Color Test</h1>
      
      <div className="space-y-8">
        {/* Filled Variant */}
        <section>
          <h2 className="text-lg font-semibold mb-4">Filled Buttons</h2>
          <div className="flex flex-wrap gap-4">
            <Button variant="filled" color="primary">Primary</Button>
            <Button variant="filled" color="secondary">Secondary</Button>
            <Button variant="filled" color="success">Success</Button>
            <Button variant="filled" color="error">Error</Button>
            <Button variant="filled" color="warning">Warning</Button>
            <Button variant="filled" color="info">Info</Button>
          </div>
        </section>

        {/* Outlined Variant */}
        <section>
          <h2 className="text-lg font-semibold mb-4">Outlined Buttons</h2>
          <div className="flex flex-wrap gap-4">
            <Button variant="outlined" color="primary">Primary</Button>
            <Button variant="outlined" color="secondary">Secondary</Button>
            <Button variant="outlined" color="success">Success</Button>
            <Button variant="outlined" color="error">Error</Button>
            <Button variant="outlined" color="warning">Warning</Button>
            <Button variant="outlined" color="info">Info</Button>
          </div>
        </section>

        {/* Text Variant */}
        <section>
          <h2 className="text-lg font-semibold mb-4">Text Buttons</h2>
          <div className="flex flex-wrap gap-4">
            <Button variant="text" color="primary">Primary</Button>
            <Button variant="text" color="secondary">Secondary</Button>
            <Button variant="text" color="success">Success</Button>
            <Button variant="text" color="error">Error</Button>
            <Button variant="text" color="warning">Warning</Button>
            <Button variant="text" color="info">Info</Button>
          </div>
        </section>

        {/* Override Classes Example */}
        <section>
          <h2 className="text-lg font-semibold mb-4">Custom Override Examples</h2>
          <div className="flex flex-wrap gap-4">
            <Button variant="filled" overrideClasses="bg-purple-500 hover:bg-purple-600 text-white">
              Purple Override
            </Button>
            <Button variant="filled" overrideClasses="bg-orange-500 hover:bg-orange-600 text-white">
              Orange Override
            </Button>
            <Button variant="filled" overrideClasses="bg-pink-500 hover:bg-pink-600 text-white">
              Pink Override
            </Button>
          </div>
        </section>

        {/* Theme Configuration Info */}
        <section className="mt-12 p-4 bg-gray-50 rounded-lg">
          <h2 className="text-lg font-semibold mb-4">Theme Configuration</h2>
          <p className="text-sm text-gray-600 mb-2">
            Theme colors are now configured in <code className="bg-gray-200 px-1 rounded">@/config/theme.ts</code>
          </p>
          <ul className="text-sm text-gray-600 space-y-1">
            <li><strong>Primary:</strong> blue-600 → blue-700 (hover)</li>
            <li><strong>Secondary:</strong> gray-500 → gray-600 (hover)</li>
            <li><strong>Success:</strong> green-600 → green-700 (hover)</li>
            <li><strong>Error:</strong> red-600 → red-700 (hover)</li>
            <li><strong>Warning:</strong> yellow-300 → yellow-400 (hover) - Uses black text for contrast</li>
            <li><strong>Info:</strong> sky-500 → sky-600 (hover)</li>
          </ul>
        </section>
      </div>
    </div>
  );
};

export default ColorTest;
