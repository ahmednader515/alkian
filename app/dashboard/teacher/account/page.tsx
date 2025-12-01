import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { User, Phone, Mail, Shield } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LogoutButton } from "@/app/dashboard/(routes)/account/_components/logout-button";

const TeacherAccountPage = async () => {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return redirect("/");
  }

  const user = session.user;

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-red-600">حسابي</h1>
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>معلومات الحساب</CardTitle>
          <CardDescription>عرض وتعديل معلومات حسابك</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-6 mb-6">
            <Avatar className="h-24 w-24">
              <AvatarImage src={user.image || ""} />
              <AvatarFallback className="text-2xl bg-red-100 text-red-600">
                {user.name?.charAt(0) || user.phoneNumber?.charAt(0) || "U"}
              </AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-2xl font-bold mb-2">{user.name || "بدون اسم"}</h2>
              <p className="text-muted-foreground">معلم</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-3 p-4 border rounded-lg">
              <User className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">الاسم الكامل</p>
                <p className="font-medium">{user.name || "غير محدد"}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 border rounded-lg">
              <Phone className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">رقم الهاتف</p>
                <p className="font-medium">{user.phoneNumber || "غير محدد"}</p>
              </div>
            </div>

            {user.email && (
              <div className="flex items-center gap-3 p-4 border rounded-lg">
                <Mail className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">البريد الإلكتروني</p>
                  <p className="font-medium">{user.email}</p>
                </div>
              </div>
            )}

            <div className="flex items-center gap-3 p-4 border rounded-lg">
              <Shield className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">نوع الحساب</p>
                <p className="font-medium">معلم</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>إعدادات الحساب</CardTitle>
        </CardHeader>
        <CardContent>
          <LogoutButton />
        </CardContent>
      </Card>
    </div>
  );
};

export default TeacherAccountPage;

