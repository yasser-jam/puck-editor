"use client"

import Field from "@/components/system/Field"

import { toast } from "sonner"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@workspace/ui/components/avatar"
import { Button } from "@workspace/ui/components/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card"
import { ArrowLeftIcon, PhoneIcon } from "lucide-react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"

type RequestOtpForm = {
  phone: string
}

export default function RequestOtpPage() {
  const router = useRouter()

  const form = useForm<RequestOtpForm>({
    defaultValues: {
      phone: "",
    },
  })

  const handleSubmit = (data: RequestOtpForm) => {
    const phone = (data.phone ?? "").trim() || "mvp-user"
    const q = encodeURIComponent(phone)
    router.push(`/verify-otp?phoneNumber=${q}`)
    toast.success("تم إرسال رمز التحقق بنجاح")
  }

  return (
    <Card className="w-full max-w-1/3">
      <form onSubmit={form.handleSubmit(handleSubmit)}>
        <CardHeader className="mb-4 text-center">
          <Avatar className="mx-auto mb-2 rounded-lg bg-primary p-8 text-5xl">
            <AvatarImage src="/logo.png" alt="logo" />
            <AvatarFallback className="font-bold text-primary-foreground">
              SOOQ
            </AvatarFallback>
          </Avatar>

          <CardTitle>طلب رمز التحقق</CardTitle>
          <CardDescription>
            أدخل رقم هاتفك لنرسل إليك رمز التحقق عبر الرسائل النصية
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-6">
            <div className="grid gap-2">
              <Field
                name="phone"
                control={form.control}
                placeholder="+963 9XX XXX XXX"
                label={
                  <>
                    <PhoneIcon className="size-4" />
                    رقم الهاتف
                  </>
                }
                inputProps={{
                  type: "tel",
                }}
              />
            </div>
          </div>
        </CardContent>
        <CardFooter className="mt-12 flex-col gap-2 px-4">
          <Button
            type="submit"
            size="lg"
            className="w-full"
          >
            إرسال الرمز
            <ArrowLeftIcon />
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
