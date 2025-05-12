
import React, { ReactNode } from 'react';

interface FormContainerProps {
  title?: string;
  children: ReactNode;
}

const FormContainer: React.FC<FormContainerProps> = ({ title, children }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6 mb-4">
      {title && <h2 className="text-lg font-medium mb-4">{title}</h2>}
      {children}
    </div>
  );
};

export default FormContainer;
