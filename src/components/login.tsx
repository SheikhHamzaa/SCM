'use client';
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { LogIn, Eye, EyeOff, Building2, Shield } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useForm } from 'react-hook-form';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';

const LoginPage: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const form = useForm({
    defaultValues: {
      username: '',
      password: '',
      rememberMe: false,
    },
  });

  const onSubmit = async (data: any) => {
    setIsLoading(true);
    console.log('Login attempt:', data);
    
    // Simulate login process
    setTimeout(() => {
      // Store user data (in real app, this would come from API)
      localStorage.setItem('userToken', 'demo-token');
      localStorage.setItem('userData', JSON.stringify({
        name: 'John Doe',
        email: data.username,
      }));
      
      setIsLoading(false);
      router.push('/isf/dashboard'); // Redirect to dashboard
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex">
      {/* Left Side - Brand Section */}
      <motion.div 
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        className="flex-1 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 flex items-center justify-center relative overflow-hidden"
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute inset-0 opacity-30">
          <div className="w-full h-full" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}></div>
        </div>
        
        <div className="relative z-10 max-w-lg mx-auto px-8 text-center text-white">
          {/* Logo Section */}
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="mb-8"
          >
            <div className="flex items-center justify-center space-x-4 mb-6">
              <div className="relative">
                <div className="w-20 h-20 relative">
                  <motion.div 
                    animate={{ rotate: [0, 360] }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-0 bg-white/20 rounded-2xl transform rotate-12"
                  ></motion.div>
                  <div className="absolute top-2 left-2 w-16 h-4 bg-red-500 rounded-sm transform -rotate-12"></div>
                  <div className="absolute top-3 left-3 w-14 h-3 bg-white rounded-sm transform rotate-6"></div>
                  <Building2 className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 text-white z-10" />
                </div>
              </div>
            </div>
            
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              <h1 className="text-5xl font-bold mb-2">
                <span className="text-white">Poly</span>
                <span className="text-yellow-400">Tex</span>
              </h1>
              <p className="text-xl font-semibold text-blue-100 tracking-wide mb-2">
                Supply Chain Management
              </p>
              <p className="text-sm text-blue-200 tracking-[0.2em] uppercase">
                Business Solution
              </p>
            </motion.div>
          </motion.div>

          {/* Features */}
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="space-y-4"
          >
            <div className="flex items-center space-x-3">
              <Shield className="w-5 h-5 text-green-400" />
              <span className="text-sm text-blue-100">Secure & Reliable Platform</span>
            </div>
            <div className="flex items-center space-x-3">
              <Building2 className="w-5 h-5 text-blue-300" />
              <span className="text-sm text-blue-100">Enterprise Grade Solution</span>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Right Side - Login Form */}
      <motion.div 
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="flex-1 flex items-center justify-center px-8 py-12"
      >
        <div className="w-full max-w-md">
          {/* Welcome Header */}
          <motion.div 
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="text-center mb-8"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h2>
            <p className="text-gray-600">Please sign in to your account</p>
          </motion.div>

          {/* Login Form */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
          >
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {/* Username Field */}
                <FormField
                  control={form.control}
                  name="username"
                  rules={{ 
                    required: "Username or email is required",
                    minLength: { value: 3, message: "Username must be at least 3 characters" }
                  }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700 font-medium">
                        Username / Email
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="text"
                          placeholder="Enter your username or email"
                          className="h-12 px-4 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                          disabled={isLoading}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Password Field */}
                <FormField
                  control={form.control}
                  name="password"
                  rules={{ 
                    required: "Password is required",
                    minLength: { value: 6, message: "Password must be at least 6 characters" }
                  }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700 font-medium">
                        Password
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            {...field}
                            type={showPassword ? "text" : "password"}
                            placeholder="Enter your password"
                            className="h-12 px-4 pr-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                            disabled={isLoading}
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 hover:bg-transparent"
                            onClick={() => setShowPassword(!showPassword)}
                            disabled={isLoading}
                          >
                            {showPassword ? (
                              <EyeOff className="w-4 h-4 text-gray-500" />
                            ) : (
                              <Eye className="w-4 h-4 text-gray-500" />
                            )}
                          </Button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Remember Me & Forgot Password */}
                <div className="flex items-center justify-between">
                  <FormField
                    control={form.control}
                    name="rememberMe"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <input
                            type="checkbox"
                            checked={field.value}
                            onChange={field.onChange}
                            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                            disabled={isLoading}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <Label className="text-sm text-gray-700 cursor-pointer">
                            Remember me
                          </Label>
                        </div>
                      </FormItem>
                    )}
                  />
                  
                  <Button
                    type="button"
                    variant="ghost"
                    className="text-blue-600 hover:text-blue-700 hover:bg-transparent p-0 h-auto font-normal text-sm"
                    disabled={isLoading}
                  >
                    Forgot password?
                  </Button>
                </div>

                {/* Sign In Button */}
                <Button
                  type="submit"
                  className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-base"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-2"
                    />
                  ) : (
                    <LogIn className="w-5 h-5 mr-2" />
                  )}
                  {isLoading ? 'Signing In...' : 'Sign In'}
                </Button>
              </form>
            </Form>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;