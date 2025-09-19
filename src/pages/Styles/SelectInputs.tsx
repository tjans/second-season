import React, { useState } from 'react';
import ContentWrapper from '@/components/ContentWrapper';
import usePageTitle from '@/hooks/usePageTitle';
import { SelectInput } from '@/components/Elements/SelectInput';
import Button from '@/components/Elements/Button';
import { useForm } from "react-hook-form";

// Import some icons for demonstration
import { FaUser, FaGlobe, FaBuilding, FaFlag, FaCog } from 'react-icons/fa';

const SelectInputStyles: React.FC = () => {
  usePageTitle('SelectInput Styles');
  
  // Form Stuff
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm();

  const [formData, setFormData] = useState({
    country: '',
    category: '',
    priority: '',
    status: ''
  });

  const handleSelectChange = (name: string) => (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [name]: e.target.value
    }));
  };

  const onSubmit = (data: any) => {
    console.log(data);
  };

  // Sample data
  const countries = [
    { value: 'us', label: 'United States' },
    { value: 'ca', label: 'Canada' },
    { value: 'uk', label: 'United Kingdom' },
    { value: 'de', label: 'Germany' },
    { value: 'fr', label: 'France' },
    { value: 'jp', label: 'Japan' },
    { value: 'au', label: 'Australia' }
  ];

  const categories = [
    { value: 'tech', label: 'Technology' },
    { value: 'design', label: 'Design' },
    { value: 'marketing', label: 'Marketing' },
    { value: 'sales', label: 'Sales' },
    { value: 'support', label: 'Support' }
  ];

  const priorities = [
    { value: 'low', label: 'Low Priority' },
    { value: 'medium', label: 'Medium Priority' },
    { value: 'high', label: 'High Priority' },
    { value: 'urgent', label: 'Urgent' }
  ];

  return (
    <ContentWrapper>
      <div className="space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">SelectInput Component Styles</h1>
          <p className="text-gray-600">
            Comprehensive showcase of the SelectInput component with Material 3 design
          </p>
        </div>

        <section>
          <h2 className="text-2xl font-semibold mb-4">React Hook Form Example</h2>
          <form onSubmit={handleSubmit(onSubmit)} className="max-w-md">
            <SelectInput
              label="Country"
              name="country"
              register={register}
              error={errors.country}
              required={true}
              options={countries}
              placeholder="Select your country"
              rules={{
                required: "Country is required"
              }}
            />
            <Button type="submit" className="mt-4">Submit</Button>
          </form>
        </section>

        {/* Basic Variants */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">Variants</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <h3 className="font-medium mb-2">Filled (Default)</h3>
              <SelectInput
                label="Category"
                name="filled-category"
                value={formData.category}
                onChange={handleSelectChange('category')}
                options={categories}
                placeholder="Choose category"
              />
              <p className="text-sm text-gray-600 mt-2">
                Background with rounded top corners
              </p>
            </div>

            <div>
              <h3 className="font-medium mb-2">Outlined</h3>
              <SelectInput
                label="Priority"
                name="outlined-priority"
                variant="outlined"
                value={formData.priority}
                onChange={handleSelectChange('priority')}
                options={priorities}
                placeholder="Select priority"
              />
              <p className="text-sm text-gray-600 mt-2">
                Full border with floating label
              </p>
            </div>

            <div>
              <h3 className="font-medium mb-2">Standard</h3>
              <SelectInput
                label="Status"
                name="standard-status"
                variant="standard"
                value={formData.status}
                onChange={handleSelectChange('status')}
              >
                <option value="">Select status</option>
                <option value="active">Active</option>
                <option value="pending">Pending</option>
                <option value="inactive">Inactive</option>
                <option value="archived">Archived</option>
              </SelectInput>
              <p className="text-sm text-gray-600 mt-2">
                Minimal bottom border only
              </p>
            </div>
          </div>
        </section>

        {/* Colors */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">Colors</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <SelectInput
              label="Primary"
              name="primary-select"
              color="primary"
              options={countries}
              placeholder="Primary color"
            />
            <SelectInput
              label="Success"
              name="success-select"
              color="success"
              options={countries}
              placeholder="Success color"
            />
            <SelectInput
              label="Error"
              name="error-select"
              color="error"
              options={countries}
              placeholder="Error color"
            />
          </div>
        </section>

        {/* Sizes */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">Sizes</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <h3 className="font-medium mb-2">Small</h3>
              <SelectInput
                label="Small Select"
                name="small-select"
                size="sm"
                options={categories}
                placeholder="Small size"
              />
            </div>

            <div>
              <h3 className="font-medium mb-2">Medium (Default)</h3>
              <SelectInput
                label="Medium Select"
                name="medium-select"
                size="md"
                options={categories}
                placeholder="Medium size"
              />
            </div>

            <div>
              <h3 className="font-medium mb-2">Large</h3>
              <SelectInput
                label="Large Select"
                name="large-select"
                size="lg"
                options={categories}
                placeholder="Large size"
              />
            </div>
          </div>
        </section>

        {/* With Icons */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">With Icons</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <SelectInput
              label="Country"
              name="country-with-icon"
              startIcon={<FaGlobe />}
              options={countries}
              placeholder="Select country"
            />
            <SelectInput
              label="Department"
              name="department-select"
              startIcon={<FaBuilding />}
              endIcon={<FaCog />}
              options={categories}
              placeholder="Select department"
            />
          </div>
        </section>

        {/* States */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">States</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <h3 className="font-medium mb-2">Required</h3>
              <SelectInput
                label="Required Field"
                name="required-select"
                required={true}
                options={priorities}
                placeholder="This field is required"
              />
            </div>

            <div>
              <h3 className="font-medium mb-2">Disabled</h3>
              <SelectInput
                label="Disabled Field"
                name="disabled-select"
                disabled={true}
                options={priorities}
                defaultValue="medium"
              />
            </div>

            <div>
              <h3 className="font-medium mb-2">With Error</h3>
              <SelectInput
                label="Error Field"
                name="error-select"
                error={{ message: "This field has an error" }}
                options={priorities}
                placeholder="Field with error"
              />
            </div>
          </div>
        </section>

        {/* Helper Text */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">Helper Text</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <SelectInput
              label="With Helper Text"
              name="helper-select"
              helperText="Choose the option that best describes your situation"
              options={categories}
              placeholder="Select option"
            />
            <SelectInput
              label="Complex Helper"
              name="complex-helper-select"
              helperText="This selection will affect your account settings and cannot be changed later"
              variant="outlined"
              options={priorities}
              placeholder="Choose carefully"
            />
          </div>
        </section>

        {/* All Variants with Different Configurations */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">Advanced Examples</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium mb-2">Filled with Icons & Helper</h3>
              <SelectInput
                label="User Role"
                name="user-role"
                startIcon={<FaUser />}
                required={true}
                helperText="Select the appropriate role for this user"
                options={[
                  { value: 'admin', label: 'Administrator' },
                  { value: 'editor', label: 'Editor' },
                  { value: 'viewer', label: 'Viewer' },
                  { value: 'guest', label: 'Guest' }
                ]}
                placeholder="Choose user role"
              />
            </div>

            <div>
              <h3 className="font-medium mb-2">Outlined Large with Custom End Icon</h3>
              <SelectInput
                label="Region"
                name="region-select"
                variant="outlined"
                size="lg"
                startIcon={<FaFlag />}
                endIcon={<FaCog />}
                color="success"
                options={[
                  { value: 'north', label: 'North America' },
                  { value: 'south', label: 'South America' },
                  { value: 'europe', label: 'Europe' },
                  { value: 'asia', label: 'Asia Pacific' },
                  { value: 'africa', label: 'Africa' }
                ]}
                placeholder="Select your region"
              />
            </div>
          </div>
        </section>

        {/* Code Examples */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">Usage Examples</h2>
          <div className="bg-gray-100 p-4 rounded-lg">
            <h3 className="font-medium mb-2">Basic Usage</h3>
            <pre className="text-sm text-gray-700 overflow-x-auto">
{`<SelectInput
  label="Country"
  name="country"
  options={countries}
  placeholder="Select country"
/>`}
            </pre>
          </div>

          <div className="bg-gray-100 p-4 rounded-lg mt-4">
            <h3 className="font-medium mb-2">With React Hook Form</h3>
            <pre className="text-sm text-gray-700 overflow-x-auto">
{`<SelectInput
  label="Category"
  name="category"
  register={register}
  error={errors.category}
  required={true}
  options={categories}
  rules={{ required: "Category is required" }}
/>`}
            </pre>
          </div>

          <div className="bg-gray-100 p-4 rounded-lg mt-4">
            <h3 className="font-medium mb-2">Full Featured</h3>
            <pre className="text-sm text-gray-700 overflow-x-auto">
{`<SelectInput
  label="Department"
  name="department"
  variant="outlined"
  size="lg"
  color="primary"
  startIcon={<FaBuilding />}
  required={true}
  helperText="Choose your department"
  options={departments}
  placeholder="Select department"
/>`}
            </pre>
          </div>
        </section>

        {/* Navigation */}
        <div className="text-center py-8">
          <Button variant="outlined" color="primary" to="/styles/textinputs">
            View TextInput Styles
          </Button>
          <span className="mx-4">•</span>
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

export default SelectInputStyles;
