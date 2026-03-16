import { Color, EndPoint, GridOptions, Intersections, Lines, Point } from "hex_renderer_javascript";

export function getOptions(isPerWorld : Boolean, darkMode : Boolean) : GridOptions {
    const lineWidth = 0.08;
    const pointRadius = lineWidth;
    const arrowRadius = lineWidth * 2;
    const maxOverlaps = 3;

    const maxScale = 0.4;
    const maxWidth = 1024;
    const maxHeight = 1024;

    const markerColor: Color = darkMode ? [255, 255, 255, 255] : [0, 0, 0, 255];
    const lineColors: Color[] = [
        [255, 107, 255, 255],
        [168, 30, 227, 255],
        [100, 144, 237, 255],
        [177, 137, 199, 255],
    ];
    const collisionColor: Color = [221, 0, 0, 255];
    const perWorldColor: Color = [168, 30, 227, 255];

    const point: Point = {
        type: "Single",
        marker: {
            color: markerColor,
            radius: pointRadius,
        },
    };

    let intersections: Intersections;
    let lines: Lines;
    if (isPerWorld) {
        intersections = {
            type: "UniformPoints",
            point,
        };

        lines = {
            type: "Monocolor",
            color: perWorldColor,
            bent: false,
        };
    } else {
        const start_point: EndPoint = {
            type: "BorderedMatch",
            match_radius: pointRadius,
            border: {
                color: markerColor,
                radius: pointRadius * 1.5,
            },
        };

        intersections = {
            type: "EndsAndMiddle",
            start: start_point,
            middle: point,
            end: start_point,
        };

        lines = {
            type: "SegmentColors",
            colors: lineColors,
            triangles: {
                type: "BorderStartMatch",
                match_radius: arrowRadius,
                border: {
                    color: markerColor,
                    radius: arrowRadius * 1.5,
                },
            },
            collisions: {
                type: "OverloadedParallel",
                max_line: maxOverlaps,
                overload: {
                    type: "Dashes",
                    color: collisionColor,
                },
            },
        };
    }

    const grid_options: GridOptions = {
        line_thickness: lineWidth,
        pattern_options: {
            type: "Uniform",
            intersections,
            lines,
        },
        center_dot: {
            type: "None",
        },
    };
    return grid_options;
}