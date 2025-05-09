
import React, { ReactNode } from 'react';

interface FormContainerProps {
  title?: string;
  children: ReactNode;
}

const FormContainer: React.FC<FormContainerProps> = ({ title, children }) => {
  return (
    <div className="space-y-4">
      {title && <h2 className="text-xl font-semibold mb-4">{title}</h2>}
      {children}
    </div>
  );
};

export default FormContainer;
