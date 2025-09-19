import React, { useState } from 'react';
import usePageTitle from '@/hooks/usePageTitle';
import ContentWrapper from '@/components/ContentWrapper';
import Button from '@/components/Elements/Button';

const Buttons: React.FC = () => {
    usePageTitle('Material Design Button Components');
    
    // State for click-once loading demo
    const [isLoading, setIsLoading] = useState(false);

    // Demo function for click-once behavior
    const handleSubmit = async () => {
        setIsLoading(true);
        try {
            // Simulate API call or async work
            await new Promise(resolve => setTimeout(resolve, 2000));
            alert('Operation completed successfully!');
        } catch (error) {
            alert('Operation failed!');
        } finally {
            setIsLoading(false);
        }
    };

    // Quick demo for immediate feedback
    const handleQuickAction = () => {
        setIsLoading(true);
        setTimeout(() => {
            setIsLoading(false);
            alert('Quick action done!');
        }, 1000);
    };

    return (
        <ContentWrapper>
            <div className="max-w-4xl mx-auto space-y-8">
                {/* Page Header */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Material Design 3 Buttons</h1>
                    <p className="text-gray-600">Comprehensive showcase of button variants, sizes, and states</p>
                </div>

                {/* Button Variants */}
                <div className="bg-white rounded-lg p-6 shadow-sm border">
                    <h2 className="text-xl font-semibold mb-4 text-gray-800">Button Variants</h2>
                    <p className="text-gray-600 mb-6">Five distinct Material Design 3 button styles for different use cases</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div className="text-center">
                            <Button variant="filled">Filled Button</Button>
                            <p className="text-xs text-gray-500 mt-2">Primary actions</p>
                        </div>
                        <div className="text-center">
                            <Button variant="outlined">Outlined Button</Button>
                            <p className="text-xs text-gray-500 mt-2">Secondary actions</p>
                        </div>
                        <div className="text-center">
                            <Button variant="text">Text Button</Button>
                            <p className="text-xs text-gray-500 mt-2">Tertiary actions</p>
                        </div>
                        <div className="text-center">
                            <Button variant="elevated">Elevated Button</Button>
                            <p className="text-xs text-gray-500 mt-2">Prominent secondary</p>
                        </div>
                        <div className="text-center">
                            <Button variant="tonal">Tonal Button</Button>
                            <p className="text-xs text-gray-500 mt-2">Subtle emphasis</p>
                        </div>
                    </div>
                </div>

                {/* Simple Color Override */}
                <div className="bg-white rounded-lg p-6 shadow-sm border">
                    <h2 className="text-xl font-semibold mb-4 text-gray-800">Simple Color Override</h2>
                    <p className="text-gray-600 mb-6">Easily override button colors with the `color` prop</p>
                    
                    <div className="space-y-6">
                        <div>
                            <h3 className="text-sm font-medium text-gray-700 mb-3">Using Predefined Colors</h3>
                            <div className="flex flex-wrap gap-3">
                                <Button variant="filled" color="primary">Primary</Button>
                                <Button variant="filled" color="secondary">Secondary</Button>
                                <Button variant="filled" color="success">Success</Button>
                                <Button variant="filled" color="error">Error</Button>
                                <Button variant="filled" color="info">Info</Button>
                                <Button variant="filled" color="warning">Warning</Button>
                            </div>
                        </div>
                        
                        <div>
                            <h3 className="text-sm font-medium text-gray-700 mb-3">Using Custom Tailwind Classes</h3>
                            <div className="flex flex-wrap gap-3">
                                <Button variant="filled" overrideClasses="bg-purple-500 hover:bg-purple-600 text-white">Purple</Button>
                                <Button variant="outlined" overrideClasses="border-orange-500 text-orange-500 hover:bg-orange-50">Orange</Button>
                                <Button variant="text" overrideClasses="text-teal-500 hover:bg-teal-50">Teal</Button>
                                <Button variant="filled" overrideClasses="bg-pink-500 hover:bg-pink-600 text-white">Pink</Button>
                            </div>
                        </div>
                        
                        <div className="mt-4 p-3 bg-blue-50 rounded-md">
                            <p className="text-sm text-blue-700">
                                <strong>💡 Usage:</strong> Use <code className="bg-white px-1 rounded">color="primary"</code> for predefined colors, 
                                or <code className="bg-white px-1 rounded">overrideClasses="bg-purple-500 hover:bg-purple-600"</code> for custom styling.
                                Always include hover states for better UX!
                            </p>
                        </div>
                    </div>
                </div>

                {/* Button Sizes */}
                <div className="bg-white rounded-lg p-6 shadow-sm border">
                    <h2 className="text-xl font-semibold mb-4 text-gray-800">Button Sizes</h2>
                    <p className="text-gray-600 mb-6">Three size variants to fit different UI contexts</p>
                    
                    <div className="flex flex-wrap items-center gap-4">
                        <div className="text-center">
                            <Button variant="filled" size="sm">Small</Button>
                            <p className="text-xs text-gray-500 mt-2">Compact spaces</p>
                        </div>
                        <div className="text-center">
                            <Button variant="filled" size="md">Medium</Button>
                            <p className="text-xs text-gray-500 mt-2">Default size</p>
                        </div>
                        <div className="text-center">
                            <Button variant="filled" size="lg">Large</Button>
                            <p className="text-xs text-gray-500 mt-2">Prominent actions</p>
                        </div>
                    </div>
                </div>

                {/* Button States */}
                <div className="bg-white rounded-lg p-6 shadow-sm border">
                    <h2 className="text-xl font-semibold mb-4 text-gray-800">Button States</h2>
                    <p className="text-gray-600 mb-6">Interactive states and accessibility features</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="text-center">
                            <Button variant="filled">Normal State</Button>
                            <p className="text-xs text-gray-500 mt-2">Default interactive state</p>
                        </div>
                        <div className="text-center">
                            <Button variant="filled" loading>Loading State</Button>
                            <p className="text-xs text-gray-500 mt-2">Processing indication</p>
                        </div>
                        <div className="text-center">
                            <Button variant="filled" disabled>Disabled State</Button>
                            <p className="text-xs text-gray-500 mt-2">Inactive/unavailable</p>
                        </div>
                    </div>
                </div>

                {/* Buttons with Icons */}
                <div className="bg-white rounded-lg p-6 shadow-sm border">
                    <h2 className="text-xl font-semibold mb-4 text-gray-800">Buttons with Icons</h2>
                    <p className="text-gray-600 mb-6">Enhanced buttons with leading and trailing icons</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <h3 className="text-sm font-medium text-gray-700">Leading Icons</h3>
                            <div className="space-y-3">
                                <Button 
                                    variant="filled" 
                                    icon={<span>⭐</span>} 
                                    iconPosition="left"
                                >
                                    Favorite
                                </Button>
                                <Button 
                                    variant="outlined" 
                                    icon={<span>📥</span>} 
                                    iconPosition="left"
                                >
                                    Download
                                </Button>
                                <Button 
                                    variant="text" 
                                    icon={<span>➕</span>} 
                                    iconPosition="left"
                                >
                                    Add Item
                                </Button>
                            </div>
                        </div>
                        
                        <div className="space-y-4">
                            <h3 className="text-sm font-medium text-gray-700">Trailing Icons</h3>
                            <div className="space-y-3">
                                <Button 
                                    variant="elevated" 
                                    icon={<span>→</span>} 
                                    iconPosition="right"
                                >
                                    Continue
                                </Button>
                                <Button 
                                    variant="tonal" 
                                    icon={<span>🔗</span>} 
                                    iconPosition="right"
                                >
                                    Share
                                </Button>
                                <Button 
                                    variant="outlined" 
                                    icon={<span>🔄</span>} 
                                    iconPosition="right"
                                >
                                    Refresh
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Full Width Buttons */}
                <div className="bg-white rounded-lg p-6 shadow-sm border">
                    <h2 className="text-xl font-semibold mb-4 text-gray-800">Full Width Buttons</h2>
                    <p className="text-gray-600 mb-6">Buttons that span the full container width</p>
                    
                    <div className="space-y-3">
                        <Button variant="filled" fullWidth>
                            Primary Full Width Action
                        </Button>
                        <Button variant="outlined" fullWidth>
                            Secondary Full Width Action
                        </Button>
                    </div>
                </div>

                {/* Click-Once Loading Buttons */}
                <div className="bg-white rounded-lg p-6 shadow-sm border">
                    <h2 className="text-xl font-semibold mb-4 text-gray-800">Click-Once Loading Buttons</h2>
                    <p className="text-gray-600 mb-6">Buttons that automatically show loading state after being clicked</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <h3 className="text-sm font-medium text-gray-700">Async Operation (Realistic)</h3>
                            <div className="space-y-3">
                                <Button 
                                    variant="filled" 
                                    loading={isLoading}
                                    onClick={handleSubmit}
                                    disabled={isLoading}
                                    color="primary"
                                >
                                    {isLoading ? 'Submitting...' : 'Submit Form'}
                                </Button>
                                <p className="text-xs text-gray-500">
                                    Simulates API call with async/await and error handling
                                </p>
                            </div>
                        </div>
                        
                        <div className="space-y-4">
                            <h3 className="text-sm font-medium text-gray-700">Quick Action</h3>
                            <div className="space-y-3">
                                <Button 
                                    variant="outlined" 
                                    loading={isLoading}
                                    onClick={handleQuickAction}
                                    disabled={isLoading}
                                    color="success"
                                >
                                    {isLoading ? 'Working...' : 'Quick Action'}
                                </Button>
                                <p className="text-xs text-gray-500">
                                    Fast operation with immediate feedback
                                </p>
                            </div>
                        </div>
                    </div>
                    
                    <div className="mt-4 p-3 bg-green-50 rounded-md">
                        <p className="text-sm text-green-700">
                            <strong>💡 Pattern:</strong> Use one <code className="bg-white px-1 rounded">isLoading</code> state 
                            with <code className="bg-white px-1 rounded">loading={isLoading}</code> 
                            and <code className="bg-white px-1 rounded">disabled={isLoading}</code> to prevent multiple clicks!
                        </p>
                    </div>
                </div>

                {/* Interactive Examples */}
                <div className="bg-white rounded-lg p-6 shadow-sm border">
                    <h2 className="text-xl font-semibold mb-4 text-gray-800">Interactive Examples</h2>
                    <p className="text-gray-600 mb-6">Buttons with different interaction behaviors</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <h3 className="text-sm font-medium text-gray-700">Click Actions</h3>
                            <div className="space-y-3">
                                <Button 
                                    variant="filled" 
                                    onClick={() => alert('Filled button clicked!')}
                                >
                                    Show Alert
                                </Button>
                                <Button 
                                    variant="outlined" 
                                    onClick={() => console.log('Logged to console')}
                                >
                                    Log to Console
                                </Button>
                            </div>
                        </div>
                        
                        <div className="space-y-4">
                            <h3 className="text-sm font-medium text-gray-700">Navigation</h3>
                            <div className="space-y-3">
                                <Button 
                                    variant="text" 
                                    to="/"
                                >
                                    Go to Home
                                </Button>
                                <Button 
                                    variant="elevated" 
                                    href="https://material.io/design"
                                    target="_blank"
                                >
                                    External Link
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Custom Color Examples */}
                <div className="bg-white rounded-lg p-6 shadow-sm border">
                    <h2 className="text-xl font-semibold mb-4 text-gray-800">Custom Color Variants</h2>
                    <p className="text-gray-600 mb-6">Semantic color variations for different contexts</p>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="text-center">
                            <Button 
                                variant="filled" 
                                className="bg-red-600 hover:bg-red-700 focus:ring-red-500"
                            >
                                Error
                            </Button>
                            <p className="text-xs text-gray-500 mt-2">Destructive actions</p>
                        </div>
                        <div className="text-center">
                            <Button 
                                variant="filled" 
                                className="bg-green-600 hover:bg-green-700 focus:ring-green-500"
                            >
                                Success
                            </Button>
                            <p className="text-xs text-gray-500 mt-2">Positive actions</p>
                        </div>
                        <div className="text-center">
                            <Button 
                                variant="filled" 
                                className="bg-yellow-600 hover:bg-yellow-700 focus:ring-yellow-500"
                            >
                                Warning
                            </Button>
                            <p className="text-xs text-gray-500 mt-2">Caution actions</p>
                        </div>
                        <div className="text-center">
                            <Button 
                                variant="filled" 
                                className="bg-gray-600 hover:bg-gray-700 focus:ring-gray-500"
                            >
                                Neutral
                            </Button>
                            <p className="text-xs text-gray-500 mt-2">Neutral actions</p>
                        </div>
                    </div>
                </div>

                {/* Usage Guidelines */}
                <div className="bg-gray-50 rounded-lg p-6 border">
                    <h2 className="text-xl font-semibold mb-4 text-gray-800">Usage Guidelines</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                        <div>
                            <h3 className="font-medium text-gray-700 mb-2">When to Use Each Variant:</h3>
                            <ul className="space-y-1 text-gray-600">
                                <li><strong>Filled:</strong> Primary actions, most important button</li>
                                <li><strong>Outlined:</strong> Secondary actions, important but not primary</li>
                                <li><strong>Text:</strong> Tertiary actions, minimal emphasis</li>
                                <li><strong>Elevated:</strong> Floating actions, prominent secondary</li>
                                <li><strong>Tonal:</strong> Medium emphasis, subtle but noticeable</li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="font-medium text-gray-700 mb-2">Accessibility Features:</h3>
                            <ul className="space-y-1 text-gray-600">
                                <li>✓ Keyboard navigation support</li>
                                <li>✓ Focus ring indicators</li>
                                <li>✓ Disabled state handling</li>
                                <li>✓ Loading state with spinner</li>
                                <li>✓ Semantic color variations</li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Configuration Guide */}
                <div className="bg-white rounded-lg p-6 shadow-sm border">
                    <h2 className="text-xl font-semibold mb-4 text-gray-800">Simple Configuration</h2>
                    <p className="text-gray-600 mb-6">Easy button customization with minimal setup</p>
                    
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div>
                            <h3 className="font-medium text-gray-700 mb-3">Button Props:</h3>
                            <div className="bg-gray-50 p-4 rounded-lg font-mono text-sm">
                                <div className="space-y-1">
                                    <div><span className="text-blue-600">variant</span>: 'filled' | 'outlined' | 'text' | 'elevated' | 'tonal'</div>
                                    <div><span className="text-blue-600">size</span>: 'sm' | 'md' | 'lg'</div>
                                    <div><span className="text-blue-600">color</span>: 'primary' | 'success' | '#ff0000'</div>
                                    <div><span className="text-blue-600">loading</span>: boolean</div>
                                    <div><span className="text-blue-600">disabled</span>: boolean</div>
                                    <div><span className="text-blue-600">fullWidth</span>: boolean</div>
                                </div>
                            </div>
                        </div>
                        <div>
                            <h3 className="font-medium text-gray-700 mb-3">Easy Customization:</h3>
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <p className="text-sm text-gray-600 mb-2">
                                    Edit <code className="bg-white px-1 rounded">@/config/app.ts</code> to set your brand colors:
                                </p>
                                <ul className="space-y-1 text-sm text-gray-600">
                                    <li>• <strong>COLORS.primary</strong> - Main brand color</li>
                                    <li>• <strong>COLORS.secondary</strong> - Secondary color</li>
                                    <li>• <strong>COLORS.success</strong> - Success actions</li>
                                    <li>• <strong>COLORS.error</strong> - Error/danger actions</li>
                                    <li>• <strong>COLORS.warning</strong> - Warning actions</li>
                                </ul>
                                <div className="mt-2 text-xs text-gray-500">
                                    Then use: <code className="bg-white px-1 rounded">color="primary"</code>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </ContentWrapper>
    );
};

export default Buttons;