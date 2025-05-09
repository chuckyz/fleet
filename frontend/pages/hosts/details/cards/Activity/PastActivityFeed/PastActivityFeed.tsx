import React from "react";

import { IHostPastActivity } from "interfaces/activity";
import { IHostPastActivitiesResponse } from "services/entities/activities";

import DataError from "components/DataError";
import Pagination from "components/Pagination";
import { ShowActivityDetailsHandler } from "components/ActivityItem/ActivityItem";

import EmptyFeed from "../EmptyFeed/EmptyFeed";

import { pastActivityComponentMap } from "../ActivityConfig";

const baseClass = "past-activity-feed";

interface IPastActivityFeedProps {
  activities?: IHostPastActivitiesResponse;
  isError?: boolean;
  onShowDetails: ShowActivityDetailsHandler;
  onNextPage: () => void;
  onPreviousPage: () => void;
}

const PastActivityFeed = ({
  activities,
  isError = false,
  onShowDetails,
  onNextPage,
  onPreviousPage,
}: IPastActivityFeedProps) => {
  if (isError) {
    return <DataError className={`${baseClass}__error`} />;
  }

  if (!activities) {
    return null;
  }

  const { activities: activitiesList, meta } = activities;

  if (activitiesList === null || activitiesList.length === 0) {
    return (
      <EmptyFeed
        title="No activity"
        message="Completed actions will appear here (scripts, software, lock, and wipe)."
        className={`${baseClass}__empty-feed`}
      />
    );
  }

  return (
    <div className={baseClass}>
      <div>
        {activitiesList.map((activity: IHostPastActivity) => {
          const ActivityItemComponent = pastActivityComponentMap[activity.type];
          return (
            <ActivityItemComponent
              key={activity.id}
              tab="past"
              activity={activity}
              hideCancel
              onShowDetails={onShowDetails}
            />
          );
        })}
      </div>
      <Pagination
        disablePrev={!meta.has_previous_results}
        disableNext={!meta.has_next_results}
        hidePagination={!meta.has_next_results && !meta.has_previous_results}
        onPrevPage={onPreviousPage}
        onNextPage={onNextPage}
      />
    </div>
  );
};

export default PastActivityFeed;
