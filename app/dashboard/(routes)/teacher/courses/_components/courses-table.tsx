"use client";

import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    useReactTable,
    getPaginationRowModel,
    SortingState,
    getSortedRowModel,
    ColumnFiltersState,
    getFilteredRowModel,
} from "@tanstack/react-table";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import Link from "next/link";
import { Pencil, Trash2, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { formatPrice } from "@/lib/format";
import { format } from "date-fns";
import { ar } from "date-fns/locale";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface DataTableProps<TData extends { id: string }, TValue> {
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
    hideActions?: boolean;
}

export function CoursesTable<TData extends { id: string }, TValue>({
    columns,
    data,
    hideActions = false,
}: DataTableProps<TData, TValue>) {
    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [filterValue, setFilterValue] = useState("");
    const router = useRouter();

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        onSortingChange: setSorting,
        getSortedRowModel: getSortedRowModel(),
        onColumnFiltersChange: setColumnFilters,
        getFilteredRowModel: getFilteredRowModel(),
        state: {
            sorting,
            columnFilters,
        },
    });

    const handleFilterChange = (value: string) => {
        setFilterValue(value);
        table.getColumn("title")?.setFilterValue(value);
    };

    const onDelete = async (courseId: string) => {
        try {
            const response = await fetch(`/api/courses/${courseId}`, {
                method: "DELETE",
            });

            if (!response.ok) {
                throw new Error("فشل حذف الكورس");
            }

            toast.success("تم حذف الكورس بنجاح");
            router.refresh();
        } catch {
            toast.error("حدث خطأ");
        }
    };

    const filteredData = table.getFilteredRowModel().rows.map(row => row.original);

    return (
        <div>
            <div className="flex items-center py-4">
                <div className="relative w-full max-w-sm">
                    <Search className="absolute h-4 w-4 top-3 left-3 text-muted-foreground" />
                    <Input
                        placeholder="ابحث عن الكورسات..."
                        value={filterValue}
                        onChange={(e) => handleFilterChange(e.target.value)}
                        className="w-full pl-9"
                    />
                </div>
            </div>
            
            {/* Mobile Card View */}
            <div className="md:hidden space-y-4">
                {filteredData.length > 0 ? (
                    filteredData.map((course) => (
                        <div key={course.id} className="border rounded-lg p-4 space-y-3">
                            <div className="flex items-start justify-between">
                                <div className="flex-1">
                                    <h3 className="font-semibold text-lg">{course.title}</h3>
                                    <div className="mt-2 space-y-1">
                                        <div className="text-sm text-muted-foreground">
                                            السعر: {formatPrice(course.price)}
                                        </div>
                                        <div className="text-sm text-muted-foreground">
                                            تاريخ الإنشاء: {format(new Date(course.createdAt), "dd/MM/yyyy", { locale: ar })}
                                        </div>
                                        {(course as any).user && (
                                            <div className="text-sm text-muted-foreground">
                                                أنشئ بواسطة: {(course as any).user.fullName || (course as any).user.phoneNumber || "غير معروف"}
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <Badge variant={course.isPublished ? "default" : "secondary"}>
                                    {course.isPublished ? "منشور" : "مسودة"}
                                </Badge>
                            </div>
                            <div className="flex items-center gap-2 pt-2 border-t">
                                <Link href={`/dashboard/teacher/courses/${course.id}`} className="flex-1">
                                    <Button variant="outline" size="sm" className="w-full">
                                        <Pencil className="h-4 w-4 mr-2" />
                                        تعديل
                                    </Button>
                                </Link>
                                <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                        <Button variant="destructive" size="sm" className="flex-1">
                                            <Trash2 className="h-4 w-4 mr-2" />
                                            حذف
                                        </Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                        <AlertDialogHeader>
                                            <AlertDialogTitle>هل أنت متأكد؟</AlertDialogTitle>
                                            <AlertDialogDescription>
                                                لا يمكن التراجع عن هذا العمل. سيتم حذف الكورس وكل محتواها بشكل دائم.
                                            </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                            <AlertDialogCancel>إلغاء</AlertDialogCancel>
                                            <AlertDialogAction onClick={() => onDelete(course.id)}>
                                                حذف
                                            </AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-8 text-muted-foreground">
                        لا يوجد نتائج.
                    </div>
                )}
            </div>

            {/* Desktop Table View */}
            <div className="hidden md:block rounded-md border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead key={header.id}>
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                    header.column.columnDef.header,
                                                    header.getContext()
                                                )}
                                        </TableHead>
                                    );
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={row.getIsSelected() && "selected"}
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext()
                                            )}
                                        </TableCell>
                                    ))}
                                    {!hideActions && (
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <Link href={`/dashboard/teacher/courses/${row.original.id}`}>
                                                    <Button variant="ghost" size="icon">
                                                        <Pencil className="h-4 w-4" />
                                                    </Button>
                                                </Link>
                                                <AlertDialog>
                                                    <AlertDialogTrigger asChild>
                                                        <Button variant="ghost" size="icon">
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </AlertDialogTrigger>
                                                    <AlertDialogContent>
                                                        <AlertDialogHeader>
                                                            <AlertDialogTitle>هل أنت متأكد؟</AlertDialogTitle>
                                                            <AlertDialogDescription>
                                                                لا يمكن التراجع عن هذا العمل. سيتم حذف الكورس وكل محتواها بشكل دائم.
                                                            </AlertDialogDescription>
                                                        </AlertDialogHeader>
                                                        <AlertDialogFooter>
                                                            <AlertDialogCancel>إلغاء</AlertDialogCancel>
                                                            <AlertDialogAction onClick={() => onDelete(row.original.id)}>
                                                                حذف
                                                            </AlertDialogAction>
                                                        </AlertDialogFooter>
                                                    </AlertDialogContent>
                                                </AlertDialog>
                                            </div>
                                        </TableCell>
                                    )}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell
                                    colSpan={columns.length}
                                    className="h-24 text-center"
                                >
                                    لا يوجد نتائج.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            <div className="flex items-center justify-end space-x-2 py-4">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => table.previousPage()}
                    disabled={!table.getCanPreviousPage()}
                >
                    السابق
                </Button>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => table.nextPage()}
                    disabled={!table.getCanNextPage()}
                >
                    التالي
                </Button>
            </div>
        </div>
    );
} 