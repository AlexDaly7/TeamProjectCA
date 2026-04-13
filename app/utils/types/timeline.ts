import type { TimelineGroup, TimelineItem } from 'vue-timeline-chart';
import type { ApiResponse } from './apiResponse';

export type TimelineTaskGroup = TimelineGroup & {
    expanded?: boolean;
    parentId: number | null;

    order: number | null;
    depth: number;
    path: number[];
};

export type TimelineLine = TimelineGroup & {
    svgPath: string;
    colour: string;
};

export type TimelineItemWithData = TimelineItem & {
    data: ApiResponse<'/api/projects/:id', 'get'>['tasks'][number];
};
