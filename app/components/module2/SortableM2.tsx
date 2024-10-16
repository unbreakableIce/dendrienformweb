import { useRef } from "react";
import { useDrag, useDrop, XYCoord } from "react-dnd";
import { Identifier } from "dnd-core";
import { Value } from "~/Data/types/module";
import { ItemTypes } from "~/utils/ItemTypes";

export type ButtonProps = {
    value: Value;
    index: number;
    moveButton: (dragIndex: number, hoverIndex: number) => void;
};

interface DragItem {
    index: number;
    id: string;
    type: string;
}

const SortableM2 = ({ value, index, moveButton }: ButtonProps) => {
    const ref = useRef<HTMLDivElement>(null);
    const [{ handlerId }, drop] = useDrop<
        DragItem,
        void,
        { handlerId: Identifier | null }
    >({
        accept: ItemTypes.BUTTON,
        collect(monitor) {
            return {
                handlerId: monitor.getHandlerId(),
            };
        },
        hover(item: DragItem, monitor) {
            if (!ref.current) {
                return;
            }
            const dragIndex = item.index;
            const hoverIndex = index;

            // Don't replace items with themselves
            if (dragIndex === hoverIndex) {
                return;
            }

            // Determine rectangle on screen
            const hoverBoundingRect = ref.current?.getBoundingClientRect();

            // Get vertical middle
            const hoverMiddleY =
                (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;

            // Determine mouse position
            const clientOffset = monitor.getClientOffset();

            // Get pixels to the top
            const hoverClientY = (clientOffset as XYCoord).y - hoverBoundingRect.top;

            // Only perform the move when the mouse has crossed half of the items height
            // When dragging downwards, only move when the cursor is below 50%
            // When dragging upwards, only move when the cursor is above 50%

            // Dragging downwards
            if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
                return;
            }

            // Dragging upwards
            if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
                return;
            }

            // Time to actually perform the action
            moveButton(dragIndex, hoverIndex);

            // Note: we're mutating the monitor item here!
            // Generally it's better to avoid mutations,
            // but it's good here for the sake of performance
            // to avoid expensive index searches.
            item.index = hoverIndex;
        },
    });

    const [{ isDragging }, drag] = useDrag({
        type: ItemTypes.BUTTON,
        item: () => {
            return { value, index };
        },
        collect: (monitor: any) => ({
            isDragging: monitor.isDragging(),
        }),
    });

    drag(drop(ref));

    return (
        <div
            ref={ref}
            className={`w-full ${isDragging ? "opacity-0" : "opacity-100"}`}
            data-handler-id={handlerId}
        >
            <button
                type="button"
                className="w-full rounded-lg border-2 border-solid border-green-500 text-left p-4"
                name={value.label}
                value={value.valueId}
            >
                <h5 className="w-full">
                    {index + 1}. {value.label}
                </h5>

            </button>
        </div>
    );
};
export default SortableM2;
