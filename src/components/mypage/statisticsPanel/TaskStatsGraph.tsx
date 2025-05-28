

import React from "react";
import {
    PieChart,
    Pie,
    Cell,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    ResponsiveContainer,
    Legend,
} from "recharts";
import type { TaskStatsDTO } from "../../../api/api";
import Styles from "./StatisticsGraph.module.css";

interface TaskStatsGraphProps {
    taskStats: TaskStatsDTO | null;
}

const StatisticsGraph: React.FC<TaskStatsGraphProps> = ({ taskStats }) => {
    if (!taskStats) return <p className={Styles.noData}>Inga grafer att visa</p>;

    const pieData = [
        { name: "Something", value: taskStats.totalEstimates },
        { name: "Something else", value: taskStats.totalEstimates },
    ];

    const barData = [
        { name: "Snitt", value: Number(taskStats.averageEstimate.toFixed(1)) },
        { name: "Median", value: Number(taskStats.median.toFixed(1)) },
    ];

    const colors = ["#4CAF50", "#F44336"]; // Grön (klar), Röd (ej klar)

    //  Anpassad etikettfunktion för centrerad text i sektorerna
    const renderCustomizedLabel = ({
        cx,
        cy,
        midAngle,
        innerRadius,
        outerRadius,
        percent,
    }: any) => {
        const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
        const x = cx + radius * Math.cos(-midAngle * (Math.PI / 180));
        const y = cy + radius * Math.sin(-midAngle * (Math.PI / 180));

        return (
            <text
                x={x}
                y={y}
                fill="#fff"
                textAnchor="middle"
                dominantBaseline="central"
                fontSize={14}
            >
                {`${(percent * 100).toFixed(0)}%`}
            </text>
        );
    };

    return (
        <div className={Styles.graphBox}>
            <div className={Styles.graphGrid}>
                <div className={Styles.graphCard}>
                    <h4>Vad ska vi ha här??</h4>
                    <ResponsiveContainer width="100%" height={250}>
                        <PieChart>
                            <Pie
                                data={pieData}
                                dataKey="value"
                                nameKey="name"
                                outerRadius={80}
                                labelLine={false}
                                label={renderCustomizedLabel}
                            >
                                {pieData.map((_, index) => (
                                    <Cell
                                        key={`cell-${index}`}
                                        fill={colors[index % colors.length]}
                                    />
                                ))}
                            </Pie>
                            <Legend verticalAlign="bottom" height={36} />
                        </PieChart>
                    </ResponsiveContainer>
                </div>

                <div className={Styles.graphCard}>
                    <h4>Gissad tid på uppgiften</h4>
                    <ResponsiveContainer width="100%" height={250}>
                        <BarChart data={barData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Bar
                                dataKey="value"
                                fill="#8884d8"
                                barSize={40}
                                radius={[4, 4, 0, 0]}
                                label={{ position: "top", fill: "#fff", fontSize: 12 }}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default StatisticsGraph;
