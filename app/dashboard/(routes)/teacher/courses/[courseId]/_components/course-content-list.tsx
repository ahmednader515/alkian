"use client";

import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";
import { Chapter, Quiz } from "@prisma/client";
import { Grip, Pencil } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Trash2 } from "lucide-react";

interface CourseItem {
    id: string;
    title: string;
    position: number;
    isPublished: boolean;
    type: "chapter" | "quiz";
    isFree?: boolean; // Only for chapters
}

interface CourseContentListProps {
    items: CourseItem[];
    onReorder: (updateData: { id: string; position: number; type: "chapter" | "quiz" }[]) => void;
    onEdit: (id: string, type: "chapter" | "quiz") => void;
    onDelete: (id: string, type: "chapter" | "quiz") => void;
}

export const CourseContentList = ({
    items,
    onReorder,
    onEdit,
    onDelete
}: CourseContentListProps) => {
    const onDragEnd = (result: DropResult) => {
        if (!result.destination) return;

        const reorderedItems = Array.from(items);
        const [movedItem] = reorderedItems.splice(result.source.index, 1);
        reorderedItems.splice(result.destination.index, 0, movedItem);

        const updateData = reorderedItems.map((item, index) => ({
            id: item.id,
            position: index + 1,
            type: item.type,
        }));

        onReorder(updateData);
    }

    return (
        <>
            {/* Mobile Card View with Drag and Drop */}
            <div className="md:hidden">
                <DragDropContext onDragEnd={onDragEnd}>
                    <Droppable droppableId="course-content-mobile">
                        {(provided) => (
                            <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-3">
                                {items.map((item, index) => (
                                    <Draggable 
                                        key={item.id} 
                                        draggableId={item.id} 
                                        index={index}
                                    >
                                        {(provided, snapshot) => (
                                            <div
                                                ref={provided.innerRef}
                                                {...provided.draggableProps}
                                                className={cn(
                                                    "border rounded-lg p-4 space-y-3 bg-card",
                                                    item.isPublished && "border-primary/20 bg-primary/5",
                                                    snapshot.isDragging && "shadow-lg opacity-75"
                                                )}
                                            >
                                                <div className="flex items-start justify-between">
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-2 mb-2">
                                                            <div
                                                                {...provided.dragHandleProps}
                                                                className="flex items-center justify-center p-1 hover:bg-muted rounded"
                                                            >
                                                                <Grip className="h-5 w-5 text-muted-foreground" />
                                                            </div>
                                                            <h3 className="font-semibold flex-1">{item.title}</h3>
                                                            <Badge variant="outline" className="text-xs">
                                                                {item.type === "chapter" ? "فصل" : "اختبار"}
                                                            </Badge>
                                                        </div>
                                                        <div className="flex items-center gap-2 flex-wrap">
                                                            {item.type === "chapter" && item.isFree && (
                                                                <Badge>مجاني</Badge>
                                                            )}
                                                            <Badge
                                                                className={cn(
                                                                    "bg-muted text-muted-foreground",
                                                                    item.isPublished && "bg-primary text-primary-foreground"
                                                                )}
                                                            >
                                                                {item.isPublished ? "تم النشر" : "مسودة"}
                                                            </Badge>
                                                            <span className="text-xs text-muted-foreground">
                                                                الموقع: {item.position}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2 pt-2 border-t">
                                                    <button
                                                        onClick={() => onEdit(item.id, item.type)}
                                                        className="flex-1 px-3 py-2 border rounded-md hover:bg-muted transition text-sm"
                                                    >
                                                        <Pencil className="h-4 w-4 inline mr-2" />
                                                        تعديل
                                                    </button>
                                                    <button
                                                        onClick={() => onDelete(item.id, item.type)}
                                                        className="flex-1 px-3 py-2 border border-red-300 text-red-600 rounded-md hover:bg-red-50 transition text-sm"
                                                    >
                                                        <Trash2 className="h-4 w-4 inline mr-2" />
                                                        حذف
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </Draggable>
                                ))}
                                {provided.placeholder}
                                {items.length === 0 && (
                                    <div className="text-center py-8 text-muted-foreground">
                                        لا يوجد محتوى
                                    </div>
                                )}
                            </div>
                        )}
                    </Droppable>
                </DragDropContext>
            </div>

            {/* Desktop List View with Drag and Drop */}
            <div className="hidden md:block">
                <DragDropContext onDragEnd={onDragEnd}>
                    <Droppable droppableId="course-content">
                        {(provided) => (
                            <div {...provided.droppableProps} ref={provided.innerRef}>
                                {items.map((item, index) => (
                                    <Draggable 
                                        key={item.id} 
                                        draggableId={item.id} 
                                        index={index}
                                    >
                                        {(provided) => (
                                            <div
                                                className={cn(
                                                    "flex items-center gap-x-2 bg-muted border-muted text-muted-foreground rounded-md mb-4 text-sm",
                                                    item.isPublished && "bg-primary/20 border-primary/20"
                                                )}
                                                ref={provided.innerRef}
                                                {...provided.draggableProps}
                                            >
                                                <div
                                                    className={cn(
                                                        "px-2 py-3 border-r border-r-muted hover:bg-muted rounded-l-md transition",
                                                        item.isPublished && "border-r-primary/20"
                                                    )}
                                                    {...provided.dragHandleProps}
                                                >
                                                    <Grip className="h-5 w-5" />
                                                </div>
                                                <div className="flex-1 px-2">
                                                    <div className="flex items-center gap-x-2">
                                                        <span>{item.title}</span>
                                                        <Badge variant="outline" className="text-xs">
                                                            {item.type === "chapter" ? "فصل" : "اختبار"}
                                                        </Badge>
                                                    </div>
                                                </div>
                                                <div className="ml-auto pr-2 flex items-center gap-x-2">
                                                    {item.type === "chapter" && item.isFree && (
                                                        <Badge>
                                                            مجاني
                                                        </Badge>
                                                    )}
                                                    <Badge
                                                        className={cn(
                                                            "bg-muted text-muted-foreground",
                                                            item.isPublished && "bg-primary text-primary-foreground"
                                                        )}
                                                    >
                                                        {item.isPublished ? "تم النشر" : "مسودة"}
                                                    </Badge>
                                                    <button
                                                        onClick={() => onEdit(item.id, item.type)}
                                                        className="hover:opacity-75 transition"
                                                    >
                                                        <Pencil className="h-4 w-4" />
                                                    </button>
                                                    <Trash2
                                                        onClick={() => onDelete(item.id, item.type)}
                                                        className="w-4 h-4 cursor-pointer hover:opacity-75 transition"
                                                    />
                                                </div>
                                            </div>
                                        )}
                                    </Draggable>
                                ))}
                                {provided.placeholder}
                            </div>
                        )}
                    </Droppable>
                </DragDropContext>
            </div>
        </>
    );
}; 