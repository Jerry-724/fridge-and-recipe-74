
import React, { ReactNode } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface FormContainerProps {
  title?: string;
  children: ReactNode;
}

const FormContainer: React.FC<FormContainerProps> = ({ title, children }) => {
  return (
    <Card className="w-full mt-6 shadow-sm">
      {title && (
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
      )}
      <CardContent>{children}</CardContent>
    </Card>
  );
};

export default FormContainer;
