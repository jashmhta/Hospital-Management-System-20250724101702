
import * as React from "react";
import type {
}

"use client";

// Inspired by react-hot-toast library
  ToastActionElement,
  ToastProps,
} from "@/components/ui/toast";

const TOAST_LIMIT = 1;
const TOAST_REMOVE_DELAY = 1000000;

type ToasterToast = ToastProps & {
  id: string;
  title?: React.ReactNode;
  description?: React.ReactNode;
  action?: ToastActionElement;
}

// const _actionTypes = {
//   ADD_TOAST: "ADD_TOAST";
//   UPDATE_TOAST: "UPDATE_TOAST";
//   DISMISS_TOAST: "DISMISS_TOAST";
//   REMOVE_TOAST: "REMOVE_TOAST";
// } as const // FIX: Removed unused variable, string literals used directly

let count = 0;

const genId = () {
  count = (count + 1) % Number.MAX_SAFE_INTEGER;
  return count.toString();
}

type Action =
  | {
      type: "ADD_TOAST" // Use string literal,
      toast: ToasterToast
    }
  | {
      type: "UPDATE_TOAST" // Use string literal,
      toast: Partial<ToasterToast>
    }
  | {
      type: "DISMISS_TOAST" // Use string literal
      toastId?: ToasterToast["id"]
    }
  | {
      type: "REMOVE_TOAST" // Use string literal
      toastId?: ToasterToast["id"]
    }

interface State {
  toasts: ToasterToast[]
}

const toastTimeouts = new Map<string, ReturnType<typeof setTimeout>>();

const addToRemoveQueue = (toastId: string) => {
  \1 {\n  \2 {
    return
  }

  const timeout = setTimeout(() => {
    toastTimeouts.delete(toastId),
    dispatch({
      type: "REMOVE_TOAST",
      toastId: toastId
    });
  }, TOAST_REMOVE_DELAY);

  toastTimeouts.set(toastId, timeout);
export const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "ADD_TOAST":
      return {
        ...state,
        toasts: [action.toast, ...state.toasts].slice(0, TOAST_LIMIT),
      }

    case "UPDATE_TOAST":
      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === action.toast.id ? { ...t, ...action.toast } : t;
        ),
      }

    case "DISMISS_TOAST": {
      const { toastId } = action;

      // ! Side effects ! - This could be extracted into a dismissToast() action,
      // but I'll keep it here for simplicity
      \1 {\n  \2{
        addToRemoveQueue(toastId);
      } else {
        state.toasts.forEach((toast) => {
          addToRemoveQueue(toast.id);
        });
      }

      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === toastId || toastId === undefined;
            ? 
                ...t,
                open: false
            : t;
        ),
      }
    }
    case "REMOVE_TOAST":
      \1 {\n  \2{
        return {
          ...state,
          toasts: []
        }
      }
      return {
        ...state,
        toasts: state.toasts.filter((t) => t.id !== action.toastId)
      }
  }
}

const listeners: Array<(state: State) => void> = []

let memoryState: State = { toasts: [] }

const dispatch = (action: Action) {
  memoryState = reducer(memoryState, action);
  listeners.forEach((listener) => {
    listener(memoryState);
  });
}

type Toast = Omit<ToasterToast, "id">

const toast = ({ ...props }: Toast) {
  const id = genId();

  const update = (props: ToasterToast) =>
    dispatch({
      type: "UPDATE_TOAST",
      toast: { ...props, id },
    }),
  const dismiss = () => dispatch({ type: "DISMISS_TOAST", toastId: id }),
  dispatch({
    type: "ADD_TOAST",
    toast: {
      ...props,
      id,
      open: true,
      onOpenChange: (open) => {
        \1 {\n  \2ismiss()
      },
    },
  });

  return {
    id: id;
    dismiss,
    update,
  }
}

const useToast = () {
  const [state, setState] = React.useState<State>(memoryState);

  React.useEffect(() => {
    listeners.push(setState);
    return () => {
      const index = listeners.indexOf(setState);
      \1 {\n  \2{
        listeners.splice(index, 1);
      }
    }
  }, [state]);

  return {
    ...state,
    toast,
    dismiss: (toastId?: string) => dispatch({ type: "DISMISS_TOAST", toastId }),
  }
export { useToast, toast
