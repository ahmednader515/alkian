"use client";

import { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Search, BookOpen, FileText, FileCheck, Award, X, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import axios from "axios";

interface SearchResult {
  courses: Array<{
    id: string;
    title: string;
    description: string | null;
    imageUrl: string | null;
    type: "course";
    href: string;
  }>;
  quizzes: Array<{
    id: string;
    title: string;
    description: string | null;
    courseTitle: string;
    questionCount: number;
    type: "quiz";
    href: string;
  }>;
  contentItems: Array<{
    id: string;
    title: string;
    content: string;
    imageUrl: string | null;
    type: "content";
    contentType: string;
    href: string;
  }>;
  certificateTemplates: Array<{
    id: string;
    title: string;
    description: string | null;
    imageUrl: string;
    type: "certificate";
    href: string;
  }>;
}

export const DashboardSearch = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Debounced search
  useEffect(() => {
    if (query.trim().length < 2) {
      setResults(null);
      setIsOpen(false);
      return;
    }

    const timeoutId = setTimeout(() => {
      performSearch(query);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [query]);

  const performSearch = async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults(null);
      return;
    }

    setIsLoading(true);
    setIsOpen(true);

    try {
      const response = await axios.get(`/api/search?q=${encodeURIComponent(searchQuery)}`);
      setResults(response.data);
    } catch (error) {
      console.error("Search error:", error);
      setResults(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  const handleInputFocus = () => {
    if (results && query.trim().length >= 2) {
      setIsOpen(true);
    }
  };

  const clearSearch = () => {
    setQuery("");
    setResults(null);
    setIsOpen(false);
    inputRef.current?.focus();
  };

  const handleResultClick = (href: string) => {
    setIsOpen(false);
    setQuery("");
    router.push(href);
  };

  const totalResults = results
    ? results.courses.length +
      results.quizzes.length +
      results.contentItems.length +
      results.certificateTemplates.length
    : 0;

  const getContentTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      ABOUT_US: "اعرفنا أكثر",
      GENERAL_NEWS: "أخبار عامة",
      ABOUT_LECTURERS: "نبذة عن المحاضرين",
      GOALS_ACHIEVEMENTS: "هدفنا وإنجازاتنا",
    };
    return labels[type] || "محتوى";
  };

  return (
    <div className="w-full relative mb-6" ref={searchRef}>
      <div className="relative w-full">
        <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input
          ref={inputRef}
          type="text"
          placeholder="ابحث عن الكورسات، الاختبارات، المحتوى..."
          value={query}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          className="h-12 pr-10 pl-4 text-base border-2 focus:border-[#052c4b] transition-colors w-full"
        />
        {query && (
          <button
            onClick={clearSearch}
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            <X className="h-5 w-5" />
          </button>
        )}
        {isLoading && (
          <div className="absolute left-12 top-1/2 transform -translate-y-1/2">
            <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
          </div>
        )}
      </div>

      {/* Results Dropdown */}
      {isOpen && query.trim().length >= 2 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg shadow-lg max-h-[600px] overflow-y-auto z-50">
          {isLoading ? (
            <div className="p-4 text-center text-muted-foreground">
              <Loader2 className="h-5 w-5 animate-spin mx-auto mb-2" />
              جاري البحث...
            </div>
          ) : totalResults === 0 ? (
            <div className="p-4 text-center text-muted-foreground">
              لا توجد نتائج للبحث
            </div>
          ) : (
            <div className="p-2">
              {/* Courses */}
              {results?.courses && results.courses.length > 0 && (
                <div className="mb-4">
                  <div className="px-3 py-2 text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                    <BookOpen className="h-4 w-4 text-red-600" />
                    الكورسات ({results.courses.length})
                  </div>
                  {results.courses.map((course) => (
                    <button
                      key={course.id}
                      onClick={() => handleResultClick(course.href)}
                      className="w-full text-right px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    >
                      <div className="font-medium text-sm">{course.title}</div>
                      {course.description && (
                        <div className="text-xs text-muted-foreground line-clamp-1 mt-1">
                          {course.description}
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              )}

              {/* Quizzes */}
              {results?.quizzes && results.quizzes.length > 0 && (
                <div className="mb-4">
                  <div className="px-3 py-2 text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                    <FileText className="h-4 w-4 text-red-600" />
                    الاختبارات ({results.quizzes.length})
                  </div>
                  {results.quizzes.map((quiz) => (
                    <button
                      key={quiz.id}
                      onClick={() => handleResultClick(quiz.href)}
                      className="w-full text-right px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    >
                      <div className="font-medium text-sm">{quiz.title}</div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {quiz.courseTitle} • {quiz.questionCount} {quiz.questionCount === 1 ? "سؤال" : "أسئلة"}
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {/* Content Items */}
              {results?.contentItems && results.contentItems.length > 0 && (
                <div className="mb-4">
                  <div className="px-3 py-2 text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                    <FileCheck className="h-4 w-4 text-red-600" />
                    المحتوى ({results.contentItems.length})
                  </div>
                  {results.contentItems.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => handleResultClick(item.href)}
                      className="w-full text-right px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    >
                      <div className="font-medium text-sm">{item.title}</div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {getContentTypeLabel(item.contentType)} • {item.content}
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {/* Certificate Templates */}
              {results?.certificateTemplates && results.certificateTemplates.length > 0 && (
                <div className="mb-4">
                  <div className="px-3 py-2 text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                    <Award className="h-4 w-4 text-red-600" />
                    نماذج الشهادات ({results.certificateTemplates.length})
                  </div>
                  {results.certificateTemplates.map((template) => (
                    <button
                      key={template.id}
                      onClick={() => handleResultClick(template.href)}
                      className="w-full text-right px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    >
                      <div className="font-medium text-sm">{template.title}</div>
                      {template.description && (
                        <div className="text-xs text-muted-foreground line-clamp-1 mt-1">
                          {template.description}
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
