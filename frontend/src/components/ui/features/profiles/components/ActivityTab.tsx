import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Data aktivitas statis
const recentActivities = [
  {
    action: "Membuat outfit baru",
    item: "Summer Casual",
    time: "2 jam yang lalu",
  },
  {
    action: "Menyukai outfit",
    item: "Office Chic by @anna_style",
    time: "4 jam yang lalu",
  },
  { action: "Mengikuti", item: "@fashion_lover", time: "1 hari yang lalu" },
  { action: "Mengomentari", item: "Weekend Vibes", time: "2 hari yang lalu" },
];

export const ActivityTab: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        {recentActivities.length > 0 ? (
          <div className="space-y-4">
            {recentActivities.map((activity, index) => (
              <div
                key={index}
                className="flex items-start gap-4 p-3 hover:bg-slate-50 rounded-lg transition-colors"
              >
                <div className="w-2 h-2 bg-purple-600 rounded-full mt-[6px]"></div>{" "}
                {/* Indikator titik */}
                <div className="flex-1">
                  <p className="text-slate-900 text-sm">
                    <span className="font-medium">{activity.action}</span>{" "}
                    <span className="text-purple-700 font-semibold">
                      {activity.item}
                    </span>
                  </p>
                  <p className="text-xs text-slate-600">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-slate-600 text-center py-8">
            Tidak ada aktivitas terbaru.
          </p>
        )}
      </CardContent>
    </Card>
  );
};
