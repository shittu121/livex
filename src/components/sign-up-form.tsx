/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'

import { cn } from '@/lib/utils'
import { createClient } from '@/lib/client'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Progress } from '@/components/ui/progress'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState, useMemo } from 'react'
import { Check, X } from 'lucide-react'

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface PasswordRequirement {
  label: string
  met: boolean
}

export function SignUpForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<'div'>) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [repeatPassword, setRepeatPassword] = useState('')
  const [role, setRole] = useState<'admin' | 'influencer' | 'brand'>('influencer')
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  // Password complexity checking
  const passwordRequirements = useMemo((): PasswordRequirement[] => {
    return [
      {
        label: 'At least 8 characters',
        met: password.length >= 8
      },
      {
        label: 'Contains uppercase letter',
        met: /[A-Z]/.test(password)
      },
      {
        label: 'Contains number',
        met: /\d/.test(password)
      },
      {
        label: 'Contains special character',
        met: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)
      }
    ]
  }, [password])

  const passwordScore = passwordRequirements.filter(req => req.met).length
  const passwordStrength = (passwordScore / passwordRequirements.length) * 100

  const getPasswordStrengthLabel = () => {
    if (passwordScore === 0) return ''
    if (passwordScore <= 1) return 'Weak'
    if (passwordScore <= 2) return 'Fair' 
    if (passwordScore <= 3) return 'Good'
    return 'Strong'
  }

  const getPasswordStrengthColor = () => {
    if (passwordScore <= 1) return 'bg-red-500'
    if (passwordScore <= 2) return 'bg-yellow-500'
    if (passwordScore <= 3) return 'bg-blue-500'
    return 'bg-green-500'
  }

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    const supabase = createClient()
    setIsLoading(true)
    setError(null)

    if (password !== repeatPassword) {
      setError('Passwords do not match')
      setIsLoading(false)
      return
    }

    // Check if all password requirements are met
    if (passwordScore < 4) {
      setError('Password must meet all complexity requirements')
      setIsLoading(false)
      return
    }

    try {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/protected`,
        },
      })

      if (signUpError) throw signUpError

      const userId = data.user?.id
      if (userId) {
        const { error: insertError } = await supabase.from('profiles').insert([
          {
            id: userId,
            role,
            email,
          },
        ])

        if (insertError) {
          setError("email already exists")
          return
        }
      }

      router.push('/auth/sign-up-success')
    } catch (error: unknown) {
      setError('An error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className={cn('flex flex-col gap-6', className)} {...props}>
      <Card className='dark:bg-slate-800 dark:border-slate-700'>
        <CardHeader>
          <CardTitle className="text-2xl">Sign up</CardTitle>
          <CardDescription>Create a new account</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSignUp}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                
                {/* Password Strength Progress Bar */}
                {password && (
                  <div className="mt-2 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        Password Strength: {getPasswordStrengthLabel()}
                      </span>
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {passwordScore}/4
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full transition-all duration-300 ${getPasswordStrengthColor()}`}
                        style={{ width: `${passwordStrength}%` }}
                      ></div>
                    </div>
                  </div>
                )}

                {/* Password Requirements Checklist */}
                {password && (
                  <div className="mt-3 space-y-2">
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Password Requirements:
                    </p>
                    <div className="space-y-1">
                      {passwordRequirements.map((requirement, index) => (
                        <div key={index} className="flex items-center gap-2">
                          {requirement.met ? (
                            <Check className="h-4 w-4 text-green-500" />
                          ) : (
                            <X className="h-4 w-4 text-red-500" />
                          )}
                          <span className={`text-sm ${
                            requirement.met 
                              ? 'text-green-600 dark:text-green-400' 
                              : 'text-red-600 dark:text-red-400'
                          }`}>
                            {requirement.label}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="grid gap-2">
                <Label htmlFor="repeat-password">Repeat Password</Label>
                <Input
                  id="repeat-password"
                  type="password"
                  required
                  value={repeatPassword}
                  onChange={(e) => setRepeatPassword(e.target.value)}
                />
                {repeatPassword && password !== repeatPassword && (
                  <div className="flex items-center gap-2 mt-1">
                    <X className="h-4 w-4 text-red-500" />
                    <span className="text-sm text-red-600 dark:text-red-400">
                      Passwords do not match
                    </span>
                  </div>
                )}
                {repeatPassword && password === repeatPassword && password && (
                  <div className="flex items-center gap-2 mt-1">
                    <Check className="h-4 w-4 text-green-500" />
                    <span className="text-sm text-green-600 dark:text-green-400">
                      Passwords match
                    </span>
                  </div>
                )}
              </div>

              <div className="grid gap-2">
                <Label htmlFor="role">Select Role</Label>
                <div className="relative inline-block w-full">
                <Select value={role} onValueChange={(value) => setRole(value as 'admin' | 'influencer' | 'brand')}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                  <SelectContent className='dark:bg-gradient-to-br dark:from-slate-900 dark:to-slate-800 dark:border-slate-700'>
                    <SelectGroup>
                      <SelectItem value="influencer">Influencer</SelectItem>
                      <SelectItem value="brand">Brand</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
                </div>
              </div>

              {error && <p className="text-sm text-red-500">{error}</p>}

              <Button 
                type="submit" 
                className="w-full" 
                disabled={isLoading || passwordScore < 4}
              >
                {isLoading ? 'Creating an account...' : 'Sign up'}
              </Button>
            </div>
            <div className="mt-4 text-center text-sm">
              Already have an account?{' '}
              <Link href="/auth/login" className="underline underline-offset-4">
                Login
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}