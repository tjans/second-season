import React from 'react';
import ContentWrapper from '@/components/ContentWrapper';
import usePageTitle from '@/hooks/usePageTitle';
import { TextInput } from '@/components/Elements/TextInput';
import { SelectInput } from '@/components/Elements/SelectInput';
import Button from '@/components/Elements/Button';
import {useForm } from "react-hook-form";

const FormStyles: React.FC = () => {
  usePageTitle('TextInput Styles');
  
  // For react hook form, include this
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data: any) => {
    console.log(data);
  };

  return (
    <ContentWrapper>
      <div className="space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Form Component Styles</h1>
          <p className="text-gray-600">
            Comprehensive showcase of the form components with Material 3 design
          </p>
        </div>

        <section>
            <form onSubmit={handleSubmit(onSubmit)}>
                <TextInput
                    label="Name"
                    name="name"
                    register={register}
                    error={errors.name}
                    required={true}
                    defaultValue={""}
                    rules={{
                    required: "Name is required"
                    }}
                />
                <SelectInput
                    label="Department"
                    name="department"
                    register={register}
                    error={errors.department}
                    required={true}
                    variant="filled"
                    options={[
                        { value: '', label: 'Select your department' },
                        { value: 'engineering', label: 'Engineering' },
                        { value: 'design', label: 'Design' },
                        { value: 'marketing', label: 'Marketing' },
                        { value: 'sales', label: 'Sales' },
                        { value: 'support', label: 'Customer Support' }
                    ]}
                    rules={{
                        required: "Department is required"
                    }}
                />                   
                <Button type="submit">Submit</Button>
            </form>
        </section>

     

        <div className="text-center py-8">
          <Button variant="outlined" color="primary" to="/styles/textinputs">
            View TextInput Styles
          </Button>
          <span className="mx-4">•</span>
          <Button variant="outlined" color="primary" to="/styles/selectinputs">
            View SelectInput Styles
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

export default FormStyles;
