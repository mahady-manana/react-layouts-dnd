import { FC, ReactNode, DragEvent } from 'react';
import { IRenderableLayout } from 'layouts-builder/interface/renderableInterface';
interface DraggableProps {
    section: IRenderableLayout;
    children: ReactNode;
    resizable?: boolean;
    width?: number;
    onDragStart: (e: DragEvent<HTMLDivElement>) => void;
    onClickSection: () => void;
    onResize?: (currentSize: number) => void;
}
export declare const DroppableSection: FC<DraggableProps>;
export {};
