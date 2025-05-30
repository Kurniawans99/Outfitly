// src/components/features/profile/components/ProfileStats.tsx
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { UserStatsState } from "../profile.types";

interface ProfileStatsProps {
  stats: UserStatsState;
}

export const ProfileStats: React.FC<ProfileStatsProps> = ({ stats }) => {
  const statItems = [
    { label: "Outfits", value: stats.outfits },
    { label: "Followers", value: stats.followers.toLocaleString() },
    { label: "Following", value: stats.following.toLocaleString() },
    { label: "Likes", value: stats.likes.toLocaleString() },
  ];

  return (
    <Card className="mb-6">
      <CardContent className="pt-6">
        {" "}
        {/* shadcn CardContent biasanya punya padding, pt-6 jika perlu */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {statItems.map((item) => (
            <div key={item.label} className="text-center">
              <div className="text-2xl font-bold text-slate-900">
                {item.value}
              </div>
              <div className="text-sm text-slate-600">{item.label}</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
