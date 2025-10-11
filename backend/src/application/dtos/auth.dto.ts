import { z } from 'zod';

// Login
export const LoginDTOSchema = z.object({
  body: z.object({
    email: z.string().email('Email inválido'),
    password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
  }),
});

export type LoginDTO = z.infer<typeof LoginDTOSchema>['body'];

// Register
export const RegisterDTOSchema = z.object({
  body: z.object({
    email: z.string().email('Email inválido'),
    password: z.string().min(8, 'La contraseña debe tener al menos 8 caracteres'),
    name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
    role: z.enum(['admin', 'empleado', 'cliente']).optional().default('cliente'),
  }),
});

export type RegisterDTO = z.infer<typeof RegisterDTOSchema>['body'];

// Refresh Token
export const RefreshTokenDTOSchema = z.object({
  body: z.object({
    refreshToken: z.string().min(1, 'Refresh token es requerido'),
  }),
});

export type RefreshTokenDTO = z.infer<typeof RefreshTokenDTOSchema>['body'];

// Change Password
export const ChangePasswordDTOSchema = z.object({
  body: z.object({
    currentPassword: z.string().min(1, 'Contraseña actual es requerida'),
    newPassword: z.string().min(8, 'La nueva contraseña debe tener al menos 8 caracteres'),
  }),
});

export type ChangePasswordDTO = z.infer<typeof ChangePasswordDTOSchema>['body'];

// Forgot Password
export const ForgotPasswordDTOSchema = z.object({
  body: z.object({
    email: z.string().email('Email inválido'),
  }),
});

export type ForgotPasswordDTO = z.infer<typeof ForgotPasswordDTOSchema>['body'];

// Reset Password
export const ResetPasswordDTOSchema = z.object({
  body: z.object({
    token: z.string().min(1, 'Token es requerido'),
    newPassword: z.string().min(8, 'La contraseña debe tener al menos 8 caracteres'),
  }),
});

export type ResetPasswordDTO = z.infer<typeof ResetPasswordDTOSchema>['body'];
