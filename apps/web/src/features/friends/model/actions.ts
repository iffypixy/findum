import {createAsyncThunk} from "@reduxjs/toolkit";

import {api} from "@shared/api";
import {RootState} from "@shared/lib/store";

const prefix = "friends";

export const fetchPotentialFriends = createAsyncThunk(
  `${prefix}/fetchPotentialFriends`,
  async (_, thunk) => {
    const state = thunk.getState() as RootState;

    const {data} = await api.getPotentialFriends({
      userId: state.auth.credentials!.id,
    });

    return data;
  },
);
