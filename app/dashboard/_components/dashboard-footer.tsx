"use client";

import { Facebook, Phone } from "lucide-react";
import Link from "next/link";

export const DashboardFooter = () => {
  return (
    <div className="mt-12 pt-6 border-t border-gray-200 dark:border-gray-800">
      <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-8 pb-6">
        {/* Facebook Link */}
        <Link
          href="https://www.facebook.com/share/18xwn9YwTx/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
        >
          <Facebook className="h-5 w-5" />
          <span className="font-medium">صفحتنا على فيسبوك</span>
        </Link>

        {/* Support Phone */}
        <a
          href="tel:01146450551"
          className="flex items-center gap-2 text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors"
        >
          <Phone className="h-5 w-5" />
          <span className="font-medium">الرقم الخاص بنا : 01146450551</span>
        </a>
      </div>
    </div>
  );
};

