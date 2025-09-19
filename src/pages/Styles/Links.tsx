import React from 'react';
import ContentWrapper from '@/components/ContentWrapper';
import Link from '@/components/Elements/Link';

const Links: React.FC = () => {
    return (
        <ContentWrapper title="Links Component">
            <div className="space-y-8">
                
                {/* Basic Links */}
                <div className="bg-white rounded-lg p-6 shadow-sm border">
                    <h2 className="text-xl font-semibold mb-4 text-gray-800">Basic Links</h2>
                    <p className="text-gray-600 mb-6">Default styled links with proper colors and hover states</p>
                    
                    <div className="space-y-4">
                        <div>
                            <h3 className="text-sm font-medium text-gray-700 mb-2">Internal Links (React Router):</h3>
                            <div className="space-y-2">
                                <div><Link to="/">Go to Home</Link></div>
                                <div><Link to="/members">Go to Members</Link></div>
                                <div><Link to="/styles/buttons">Go to Buttons</Link></div>
                            </div>
                        </div>
                        
                        <div>
                            <h3 className="text-sm font-medium text-gray-700 mb-2">External Links:</h3>
                            <div className="space-y-2">
                                <div><Link external href="https://react.dev" target="_blank">React Documentation</Link></div>
                                <div><Link external href="https://tailwindcss.com" target="_blank">Tailwind CSS</Link></div>
                                <div><Link external href="https://vitejs.dev" target="_blank">Vite</Link></div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Custom Colors */}
                <div className="bg-white rounded-lg p-6 shadow-sm border">
                    <h2 className="text-xl font-semibold mb-4 text-gray-800">Custom Colors</h2>
                    <p className="text-gray-600 mb-6">Override link colors using predefined colors or custom hex values</p>
                    
                    <div className="space-y-4">
                        <div>
                            <h3 className="text-sm font-medium text-gray-700 mb-2">Using Predefined Colors:</h3>
                            <div className="space-y-2">
                                <div><Link to="/" color="primary">Primary color link</Link></div>
                                <div><Link to="/" color="success">Success color link</Link></div>
                                <div><Link to="/" color="error">Error color link</Link></div>
                                <div><Link to="/" color="warning">Warning color link</Link></div>
                                <div><Link to="/" color="info">Info color link</Link></div>
                            </div>
                        </div>
                        
                        <div>
                            <h3 className="text-sm font-medium text-gray-700 mb-2">Using Custom Tailwind Classes:</h3>
                            <div className="space-y-2">
                                <div><Link to="/" overrideClasses="text-purple-600 decoration-purple-600 hover:text-purple-500">Purple link</Link></div>
                                <div><Link to="/" overrideClasses="text-orange-600 decoration-orange-600 hover:text-orange-500">Orange link</Link></div>
                                <div><Link to="/" overrideClasses="text-teal-600 decoration-teal-600 hover:text-teal-500">Teal link</Link></div>
                                <div><Link to="/" overrideClasses="text-pink-600 decoration-pink-600 hover:text-pink-500">Pink link</Link></div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Underline Options */}
                <div className="bg-white rounded-lg p-6 shadow-sm border">
                    <h2 className="text-xl font-semibold mb-4 text-gray-800">Underline Options</h2>
                    <p className="text-gray-600 mb-6">Control underline behavior with the underline prop</p>
                    
                    <div className="space-y-4">
                        <div>
                            <h3 className="text-sm font-medium text-gray-700 mb-2">Underline Variations:</h3>
                            <div className="space-y-2">
                                <div><Link to="/">Default underlined link</Link> (uses LINK_CONFIG.underline)</div>
                                <div><Link to="/" underline={true}>Always underlined link</Link></div>
                                <div><Link to="/" underline={false}>No underline link (hover to see)</Link></div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Usage in Text */}
                <div className="bg-white rounded-lg p-6 shadow-sm border">
                    <h2 className="text-xl font-semibold mb-4 text-gray-800">Links in Text</h2>
                    <p className="text-gray-600 mb-6">How links look when embedded in paragraphs</p>
                    
                    <div className="space-y-4 text-gray-700">
                        <p>
                            This is a paragraph with a <Link to="/members">link to members</Link> embedded in the text. 
                            The link should stand out properly while maintaining good readability.
                        </p>
                        <p>
                            You can also have <Link external href="https://github.com" target="_blank" color="success">external links</Link> that 
                            open in new tabs, or <Link to="/" overrideClasses="text-purple-600 decoration-purple-600 hover:text-purple-500">custom colored links</Link> for special emphasis.
                        </p>
                        <p>
                            For subtle links, you might want <Link to="/" underline={false} color="secondary">no underline</Link> until hover, 
                            or for important actions use <Link to="/" color="error">error colored links</Link>.
                        </p>
                    </div>
                </div>

                {/* Configuration Guide */}
                <div className="bg-white rounded-lg p-6 shadow-sm border">
                    <h2 className="text-xl font-semibold mb-4 text-gray-800">Configuration</h2>
                    <p className="text-gray-600 mb-6">Customize link appearance in config.ts</p>
                    
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div>
                            <h3 className="font-medium text-gray-700 mb-3">Link Props:</h3>
                            <div className="bg-gray-50 p-4 rounded-lg font-mono text-sm">
                                <div className="space-y-1">
                                    <div><span className="text-blue-600">to</span>: string (for internal links)</div>
                                    <div><span className="text-blue-600">external</span>: boolean</div>
                                    <div><span className="text-blue-600">href</span>: string (for external links)</div>
                                    <div><span className="text-blue-600">color</span>: 'primary' | '#ff0000'</div>
                                    <div><span className="text-blue-600">underline</span>: boolean</div>
                                    <div><span className="text-blue-600">target</span>: '_blank' | '_self'</div>
                                </div>
                            </div>
                        </div>
                        <div>
                            <h3 className="font-medium text-gray-700 mb-3">Config Settings:</h3>
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <p className="text-sm text-gray-600 mb-2">
                                    Edit <code className="bg-white px-1 rounded">LINK_CONFIG</code> in config.ts:
                                </p>
                                <ul className="space-y-1 text-sm text-gray-600">
                                    <li>• <strong>defaultColor</strong> - Default link color</li>
                                    <li>• <strong>hoverColor</strong> - Color on hover</li>
                                    <li>• <strong>underline</strong> - Default underline behavior</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </ContentWrapper>
    );
};

export default Links;
