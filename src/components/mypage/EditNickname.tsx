
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

interface EditNicknameProps {
  onCancel: () => void;
  onSubmit: (currentPassword: string, newNickname: string) => Promise<void>;
  loading: boolean;
}

const formSchema = z.object({
  currentPassword: z.string().min(1, "비밀번호를 입력해주세요."),
  newNickname: z.string().min(1, "새 닉네임을 입력해주세요."),
});

const EditNickname: React.FC<EditNicknameProps> = ({ onCancel, onSubmit, loading }) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      currentPassword: "",
      newNickname: "",
    },
  });

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    await onSubmit(values.currentPassword, values.newNickname);
  };

  return (
    <FormContainer>
      <h2 className="text-lg font-medium mb-4">닉네임 변경</h2>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-3">
          <FormField
            control={form.control}
            name="currentPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>현재 비밀번호</FormLabel>
                <FormControl>
                  <Input type="password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="newNickname"
            render={({ field }) => (
              <FormItem>
                <FormLabel>새 닉네임</FormLabel>
                <FormControl>
                  <Input type="text" {...field} />
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
              disabled={loading}
              className="flex-1"
            >
              {loading ? '처리 중...' : '변경'}
            </Button>
          </div>
        </form>
      </Form>
    </FormContainer>
  );
};

export default EditNickname;
