import {createAction} from "@reduxjs/toolkit";

import {Notification} from "@shared/lib/types";

const prefix = "notifications";

export const addNotification = createAction<Notification>(
  `${prefix}/addNotification`,
);

export const setNotRead = createAction<boolean>(`${prefix}/setNotRead`);
