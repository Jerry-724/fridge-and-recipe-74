
import React from 'react';
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import FormContainer from './FormContainer';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { AlertCircle } from "lucide-react";

interface DeleteAccountProps {
  onCancel: () => void;
  onDelete: (password: string) => Promise<void>;
  loading: boolean;
}

const formSchema = z.object({
  password: z.string().min(1, "비밀번호를 입력해주세요"),
});

const DeleteAccount: React.FC<DeleteAccountProps> = ({ onCancel, onDelete, loading }) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: "",
    },
  });

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    await onDelete(values.password);
  };

  return (
    <FormContainer>
      <div className="mb-5 text-center text-destructive">
        <AlertCircle className="h-10 w-10 mx-auto mb-2" />
        <p className="text-lg font-medium">정말 탈퇴하시겠습니까?</p>
        <p>이 작업은 되돌릴 수 없습니다.</p>
      </div>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-3">
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>비밀번호 확인</FormLabel>
                <FormControl>
                  <Input type="password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <div className="flex space-x-2 pt-3">
            <Button
              type="button"
              onClick={onCancel}
              variant="outline"
              className="flex-1"
            >
              취소
            </Button>
            <Button
              type="submit"
              variant="destructive"
              disabled={loading}
              className="flex-1"
            >
              {loading ? '처리 중...' : '탈퇴'}
            </Button>
          </div>
        </form>
      </Form>
    </FormContainer>
  );
};

export default DeleteAccount;
