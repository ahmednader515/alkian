"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { useSession } from "next-auth/react";
import { Wallet, Plus, History, ArrowUpRight, MessageCircle, Phone } from "lucide-react";

interface BalanceTransaction {
  id: string;
  amount: number;
  type: "DEPOSIT" | "PURCHASE";
  description: string;
  createdAt: string;
}

export default function BalancePage() {
  const { data: session } = useSession();
  const [balance, setBalance] = useState(0);
  const [amount, setAmount] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [transactions, setTransactions] = useState<BalanceTransaction[]>([]);
  const [isLoadingTransactions, setIsLoadingTransactions] = useState(true);

  // Check if user is a student (USER role)
  const isStudent = session?.user?.role === "USER";

  useEffect(() => {
    fetchBalance();
    fetchTransactions();
  }, []);

  const fetchBalance = async () => {
    try {
      const response = await fetch("/api/user/balance");
      if (response.ok) {
        const data = await response.json();
        setBalance(data.balance);
      }
    } catch (error) {
      console.error("Error fetching balance:", error);
    }
  };

  const fetchTransactions = async () => {
    try {
      const response = await fetch("/api/balance/transactions");
      if (response.ok) {
        const data = await response.json();
        setTransactions(data);
      }
    } catch (error) {
      console.error("Error fetching transactions:", error);
    } finally {
      setIsLoadingTransactions(false);
    }
  };

  const handleAddBalance = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      toast.error("يرجى إدخال مبلغ صحيح");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch("/api/balance/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ amount: parseFloat(amount) }),
      });

      if (response.ok) {
        const data = await response.json();
        setBalance(data.newBalance);
        setAmount("");
        toast.success("تم إضافة الرصيد بنجاح");
        fetchTransactions(); // Refresh transactions
      } else {
        const error = await response.text();
        toast.error(error || "حدث خطأ أثناء إضافة الرصيد");
      }
    } catch (error) {
      console.error("Error adding balance:", error);
      toast.error("حدث خطأ أثناء إضافة الرصيد");
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("ar-EG", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="p-4 md:p-6 space-y-4 md:space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
        <div>
          <h1 className="text-xl md:text-2xl font-bold">إدارة الرصيد</h1>
          <p className="text-sm md:text-base text-muted-foreground">
            {isStudent 
              ? "عرض رصيد حسابك وسجل المعاملات" 
              : "أضف رصيد إلى حسابك لشراء الكورسات"
            }
          </p>
        </div>
      </div>

      {/* Balance Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wallet className="h-5 w-5" />
            رصيد الحساب
          </CardTitle>
          <CardDescription>
            الرصيد المتاح في حسابك
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-2xl md:text-3xl font-bold text-[#052c4b]">
            {balance.toFixed(2)} جنيه
          </div>
        </CardContent>
      </Card>

      {/* Add Balance Instructions - Only for students */}
      {isStudent && (
        <Card className="bg-blue-50 border-blue-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-800 text-lg md:text-xl">
              <Phone className="h-4 w-4 md:h-5 md:w-5" />
              طريقة إضافة الرصيد
            </CardTitle>
            <CardDescription className="text-blue-700 text-sm md:text-base">
              لإضافة رصيد إلى حسابك، يرجى اتباع الخطوات التالية:
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 md:space-y-4">
            <div className="space-y-2">
              <p className="text-xs md:text-sm font-medium text-blue-900">
                1. أرسل المبلغ المطلوب عبر:
              </p>
              <ul className="list-disc list-inside space-y-1 text-xs md:text-sm text-blue-800 mr-2 md:mr-4">
                <li>فودافون كاش (Vodafone Cash)</li>
                <li>إنستاباي (Instapay)</li>
              </ul>
              <p className="text-base md:text-lg font-bold text-blue-900 mt-2 md:mt-3 break-all">
                إلى الرقم: 01066504332
              </p>
            </div>
            <div className="space-y-2">
              <p className="text-xs md:text-sm font-medium text-blue-900">
                2. بعد إتمام التحويل:
              </p>
              <p className="text-xs md:text-sm text-blue-800">
                أرسل صورة إيصال التحويل عبر واتساب إلى نفس الرقم
              </p>
            </div>
            <Button
              asChild
              className="w-full bg-green-600 hover:bg-green-700 text-white text-sm md:text-base py-2 md:py-2.5"
            >
              <a
                href="https://wa.me/201066504332"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2"
              >
                <MessageCircle className="h-4 w-4" />
                فتح واتساب لإرسال الإيصال
              </a>
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Add Balance Section - Only for non-students */}
      {!isStudent && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5" />
              إضافة رصيد
            </CardTitle>
            <CardDescription>
              أضف مبلغ إلى رصيد حسابك
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-3 md:gap-4">
              <Input
                type="number"
                placeholder="أدخل المبلغ"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                min="0"
                step="0.01"
                className="flex-1"
              />
              <Button 
                onClick={handleAddBalance}
                disabled={isLoading}
                className="bg-[#052c4b] hover:bg-[#052c4b]/90 w-full md:w-auto"
              >
                {isLoading ? "جاري الإضافة..." : "إضافة الرصيد"}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Transaction History */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <History className="h-5 w-5" />
            سجل المعاملات
          </CardTitle>
          <CardDescription>
            تاريخ جميع المعاملات المالية
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoadingTransactions ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#052c4b] mx-auto"></div>
              <p className="mt-2 text-muted-foreground">جاري التحميل...</p>
            </div>
          ) : transactions.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">لا توجد معاملات حتى الآن</p>
            </div>
          ) : (
            <div className="space-y-3 md:space-y-4">
              {transactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 p-3 md:p-4 border rounded-lg"
                >
                  <div className="flex items-start md:items-center gap-3 flex-1 min-w-0">
                    <div className={`p-2 rounded-full flex-shrink-0 ${
                      transaction.type === "DEPOSIT" 
                        ? "bg-green-100 text-green-600" 
                        : "bg-red-100 text-red-600"
                    }`}>
                      {transaction.type === "DEPOSIT" ? (
                        <Plus className="h-4 w-4" />
                      ) : (
                        <ArrowUpRight className="h-4 w-4" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm md:text-base break-words">
                        {transaction.description.includes("Added") && transaction.type === "DEPOSIT" 
                          ? transaction.description.replace(/Added (\d+(?:\.\d+)?) EGP to balance/, "تم إضافة $1 جنيه إلى الرصيد")
                          : transaction.description.includes("Purchased course:") && transaction.type === "PURCHASE"
                          ? transaction.description.replace(/Purchased course: (.+)/, "تم شراء الكورس: $1")
                          : transaction.description
                        }
                      </p>
                      <p className="text-xs md:text-sm text-muted-foreground mt-1">
                        {formatDate(transaction.createdAt)}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {transaction.type === "DEPOSIT" ? "إيداع" : "شراء كورس"}
                      </p>
                    </div>
                  </div>
                  <div className={`font-bold text-lg md:text-xl flex-shrink-0 ${
                    transaction.type === "DEPOSIT" ? "text-green-600" : "text-red-600"
                  }`}>
                    {transaction.type === "DEPOSIT" ? "+" : "-"}
                    {Math.abs(transaction.amount).toFixed(2)} جنيه
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 