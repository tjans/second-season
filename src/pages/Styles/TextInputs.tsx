import React, { useState } from 'react';
import ContentWrapper from '@/components/ContentWrapper';
import usePageTitle from '@/hooks/usePageTitle';
import { TextInput } from '@/components/Elements/TextInput';
import Button from '@/components/Elements/Button';
import { set, useForm } from "react-hook-form";

// Import some icons for demonstration
import { FaSearch, FaUser, FaLock, FaEnvelope, FaPhone } from 'react-icons/fa';

const TextInputStyles: React.FC = () => {
  usePageTitle('TextInput Styles');
  
  // For react hook form, include this
  const {
    register,
    handleSubmit,
    formState: { errors },
    setFocus,
    setValue
  } = useForm();

  const [formData, setFormData] = useState({
    basicText: '',
    email: '',
    password: '',
    search: '',
    description: ''
  });

  const handleInputChange = (name: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [name]: e.target.value
    }));
  };

  const handleClear = (name: string) => () => {
    setFormData(prev => ({
      ...prev,
      [name]: ''
    }));
  };

  const onSubmit = (data: any) => {
    console.log(data);
  };

  return (
    <ContentWrapper>
      <div className="space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">TextInput Component Styles</h1>
          <p className="text-gray-600">
            Comprehensive showcase of the TextInput component with Material 3 design
          </p>
        </div>

        <section>
            <form onSubmit={handleSubmit(onSubmit)}>
                <TextInput
                    label="Name"
                    name="name"
                    register={register}
                    error={errors.name}
                    defaultValue={"Some Default Value"}
                    rules={{
                    required: "Name is required"
                    }}
                />                    
                <Button type="submit">Submit</Button>
            </form>
        </section>

        {/* Basic Variants */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">Variants</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <h3 className="font-medium mb-2">Filled (Default)</h3>
              <TextInput
                name="filled-demo"
                label="Filled Input"
                placeholder="Enter text..."
                helperText="Background with rounded top corners"
              />
            </div>
            
            <div>
              <h3 className="font-medium mb-2">Outlined</h3>
              <TextInput
                name="outlined-demo"
                label="Outlined Input"
                variant="outlined"
                placeholder="Enter text..."
                helperText="Full border with rounded corners"
              />
            </div>
            
            <div>
              <h3 className="font-medium mb-2">Standard</h3>
              <TextInput
                name="standard-demo"
                label="Standard Input"
                variant="standard"
                placeholder="Enter text..."
                helperText="Bottom border only"
              />
            </div>
          </div>
        </section>

        {/* Colors */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">Colors</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <TextInput
              name="primary-color"
              label="Primary Color"
              color="primary"
              variant="outlined"
              helperText="Blue focus color"
            />
            
            <TextInput
              name="success-color"
              label="Success Color"
              color="success"
              variant="outlined"
              helperText="Green focus color"
            />
            
            <TextInput
              name="error-color"
              label="Error Color"
              color="error"
              variant="outlined"
              helperText="Red focus color"
            />
          </div>
        </section>

        {/* Sizes */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">Sizes</h2>
          <div className="space-y-4">
            <TextInput
              name="small-size"
              label="Small Size"
              size="sm"
              variant="outlined"
              helperText="Compact size for dense layouts"
            />
            
            <TextInput
              name="medium-size"
              label="Medium Size (Default)"
              size="md"
              variant="outlined"
              helperText="Standard size for most use cases"
            />
            
            <TextInput
              name="large-size"
              label="Large Size"
              size="lg"
              variant="outlined"
              helperText="Large size for prominent forms"
            />
          </div>
        </section>

        {/* Icons */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">With Icons</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <TextInput
              name="search-icon"
              label="Search"
              variant="filled"
              startIcon={<FaSearch />}
              placeholder="Search..."
              clearable
              value={formData.search}
              onChange={handleInputChange('search')}
              onClear={handleClear('search')}
            />
            
            <TextInput
              name="user-icon"
              label="Username"
              variant="outlined"
              startIcon={<FaUser />}
              endIcon={<FaEnvelope />}
              placeholder="Enter username"
            />
          </div>
        </section>

        {/* Input Types */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">Input Types</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <TextInput
              name="email-input"
              label="Email Address"
              type="email"
              variant="outlined"
              startIcon={<FaEnvelope />}
              placeholder="user@example.com"
              value={formData.email}
              onChange={handleInputChange('email')}
              clearable
              onClear={handleClear('email')}
            />
            
            <TextInput
              name="password-input"
              label="Password"
              type="password"
              variant="outlined"
              startIcon={<FaLock />}
              placeholder="Enter password"
              value={formData.password}
              onChange={handleInputChange('password')}
            />
            
            <TextInput
              name="phone-input"
              label="Phone Number"
              type="tel"
              variant="filled"
              startIcon={<FaPhone />}
              placeholder="(555) 123-4567"
            />
            
            <TextInput
              name="number-input"
              label="Age"
              type="number"
              variant="standard"
              placeholder="Enter age"
              helperText="Numbers only"
            />
          </div>
        </section>

        {/* Multiline */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">Multiline (Textarea)</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <TextInput
              name="description-filled"
              label="Description (Filled)"
              variant="filled"
              multiline
              rows={4}
              placeholder="Tell us about yourself..."
              value={formData.description}
              onChange={handleInputChange('description')}
              clearable
              onClear={handleClear('description')}
              helperText="Maximum 500 characters"
              maxLength={500}
            />
            
            <TextInput
              name="description-outlined"
              label="Comments (Outlined)"
              variant="outlined"
              multiline
              rows={4}
              placeholder="Enter your comments..."
              helperText="Share your thoughts"
            />
          </div>
        </section>

        {/* States */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">States</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <TextInput
              name="required-input"
              label="Required Field"
              variant="outlined"
              required
              helperText="This field is required"
            />
            
            <TextInput
              name="disabled-input"
              label="Disabled Field"
              variant="outlined"
              disabled
              value="Cannot edit this"
              helperText="This field is disabled"
            />
            
            <TextInput
              name="error-input"
              label="Field with Error"
              variant="outlined"
              error={{ message: "This field has an error" }}
              helperText="Helper text is replaced by error"
            />
            
            <TextInput
              name="maxlength-input"
              label="Character Limit"
              variant="filled"
              maxLength={20}
              helperText="Maximum 20 characters"
            />
          </div>
        </section>

        {/* Full Width */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">Full Width</h2>
          <TextInput
            name="fullwidth-input"
            label="Full Width Input"
            variant="outlined"
            fullWidth
            placeholder="This input takes the full width of its container"
            helperText="Great for forms and wide layouts"
          />
        </section>

        {/* Custom Override */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">Custom Styling</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <TextInput
              name="custom-purple"
              label="Custom Purple Style"
              overrideClasses="relative p-4 bg-purple-100 border-2 border-purple-400 rounded-xl focus-within:border-purple-600 transition-colors"
              placeholder="Custom purple styling"
              helperText="Using overrideClasses prop"
            />
            
            <TextInput
              name="custom-green"
              label="Custom Green Style"
              overrideClasses="relative p-3 bg-green-50 border-l-4 border-green-500 rounded-r-lg shadow-md"
              placeholder="Custom green styling"
              helperText="Completely custom appearance"
            />
          </div>
        </section>

        {/* Usage Examples */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">Usage Examples</h2>
          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="font-medium mb-4">Code Examples:</h3>
            <div className="space-y-4 text-sm font-mono bg-white p-4 rounded border overflow-x-auto">
              <div>
                <div className="text-gray-600">// Basic filled input</div>
                <div className="text-blue-600">&lt;TextInput name="email" label="Email" variant="filled" /&gt;</div>
              </div>
              
              <div>
                <div className="text-gray-600">// Outlined with icon and clear</div>
                <div className="text-blue-600">&lt;TextInput name="search" label="Search" variant="outlined" startIcon=&#123;&lt;SearchIcon /&gt;&#125; clearable /&gt;</div>
              </div>
              
              <div>
                <div className="text-gray-600">// Multiline with character limit</div>
                <div className="text-blue-600">&lt;TextInput name="desc" label="Description" multiline rows=&#123;4&#125; maxLength=&#123;500&#125; /&gt;</div>
              </div>
              
              <div>
                <div className="text-gray-600">// Custom styling</div>
                <div className="text-blue-600">&lt;TextInput name="custom" label="Custom" overrideClasses="custom-styles" /&gt;</div>
              </div>
            </div>
          </div>
        </section>

        <div className="text-center py-8">
          <Button variant="outlined" color="primary" to="/styles/buttons">
            View Button Styles
          </Button>
          <span className="mx-4">•</span>
          <Button variant="outlined" color="primary" to="/styles/links">
            View Link Styles
          </Button>
        </div>
      </div>
    </ContentWrapper>
  );
};

export default TextInputStyles;
