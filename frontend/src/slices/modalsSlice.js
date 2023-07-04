/* eslint-disable no-param-reassign */
import { createSlice, createEntityAdapter } from '@reduxjs/toolkit';

const modalsAdapter = createEntityAdapter();

const initialState = modalsAdapter.getInitialState({ type: null, channel: null });

const modalsSlice = createSlice({
  name: 'modals',
  initialState,
  reducers: {
    showModal: (state, { payload: { type, channel = null } }) => {
      state.channel = channel;
      state.type = type;
    },
    hideModal: (state) => {
      state.channel = null;
      state.type = null;
    },
  },
});
// END

export const { showModal, hideModal } = modalsSlice.actions;
export default modalsSlice.reducer;
