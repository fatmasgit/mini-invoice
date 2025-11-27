"use client";

import { useReducer } from "react";
import { v4 as uuid } from "uuid";

export type Item = {
  id: string;
  title: string;
  qty: number;
  price: number;
};

type State = {
  items: Item[];
  selectedId: string | null;
};

type Action =
  | { type: "ADD_ITEM" }
  | { type: "UPDATE_ITEM"; id: string; payload: Partial<Item> }
  | { type: "REMOVE_ITEM"; id: string }
  | { type: "REORDER"; items: Item[] }
  | { type: "SELECT"; id: string };

const initialState: State = {
  items: [
    {
      id: uuid(),
      title: "Sample Item",
      qty: 1,
      price: 10,
    },
  ],
  selectedId: null,
};

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "ADD_ITEM": {
      const newItem = {
        id: uuid(),
        title: "",
        qty: 1,
        price: 0,
      };

      return {
        ...state,
        items: [newItem, ...state.items],
        selectedId: newItem.id,
      };
    }

    case "UPDATE_ITEM":
      return {
        ...state,
        items: state.items.map((it) =>
          it.id === action.id ? { ...it, ...action.payload } : it
        ),
      };

    case "REMOVE_ITEM":
      return {
        ...state,
        items: state.items.filter((i) => i.id !== action.id),
        selectedId: state.selectedId === action.id ? null : state.selectedId,
      };

    case "REORDER":
      return {
        ...state,
        items: action.items,
      };

    case "SELECT":
      return {
        ...state,
        selectedId: action.id,
      };

    default:
      return state;
  }
}

export function useItemsReducer() {
  const [state, dispatch] = useReducer(reducer, initialState);
  return { state, dispatch };
}
