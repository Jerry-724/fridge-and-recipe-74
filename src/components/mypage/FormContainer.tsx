
import React, { ReactNode } from 'react';
import { Card, CardContent } from "@/components/ui/card";

interface FormContainerProps {
  title?: string;
  children: ReactNode;
}

const FormContainer: React.FC<FormContainerProps> = ({ title, children }) => {
  return (
    <Card className="w-full">
      <CardContent className="p-5">{children}</CardContent>
    </Card>
  );
};

export default FormContainer;
