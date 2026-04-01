'use client';

import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import type { CartItem } from '@/types/product.types';
import { CART_STORAGE_KEY, CART_EXPIRY_DAYS } from '@/lib/constants';
import { isBrowser } from '@/lib/utils';

interface CartState {
  items: CartItem[];
  isOpen: boolean;
}

type CartAction =
  | { type: 'ADD_ITEM'; item: CartItem }
  | { type: 'REMOVE_ITEM'; productId: string; variantId: string }
  | { type: 'UPDATE_QUANTITY'; productId: string; variantId: string; quantity: number }
  | { type: 'CLEAR_CART' }
  | { type: 'OPEN_CART' }
  | { type: 'CLOSE_CART' }
  | { type: 'LOAD_CART'; items: CartItem[] };

interface CartContextValue extends CartState {
  addItem: (item: CartItem) => void;
  removeItem: (productId: string, variantId: string) => void;
  updateQuantity: (productId: string, variantId: string, quantity: number) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  totalItems: number;
  totalPrice: number;
}

function isValidCartItem(item: unknown): item is CartItem {
  if (!item || typeof item !== 'object') return false;
  const i = item as Record<string, unknown>;
  return (
    typeof i.productId === 'string' && i.productId.length <= 50 &&
    typeof i.variantId === 'string' &&
    typeof i.quantity === 'number' && Number.isInteger(i.quantity) && i.quantity >= 1 && i.quantity <= 99 &&
    typeof i.productName === 'string' && i.productName.length <= 200 &&
    typeof i.variantLabel === 'string' &&
    typeof i.price === 'number' && i.price > 0 &&
    typeof i.imageUrl === 'string'
  );
}

function loadCartFromStorage(): CartItem[] {
  if (!isBrowser()) return [];
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as { items?: unknown[]; expiresAt?: string };
    if (!parsed.expiresAt || new Date(parsed.expiresAt) < new Date()) {
      localStorage.removeItem(CART_STORAGE_KEY);
      return [];
    }
    if (!Array.isArray(parsed.items)) return [];
    return parsed.items.filter(isValidCartItem).slice(0, 50);
  } catch {
    return [];
  }
}

function saveCartToStorage(items: CartItem[]): void {
  if (!isBrowser()) return;
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + CART_EXPIRY_DAYS);
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify({ items, expiresAt: expiresAt.toISOString() }));
  } catch {
    // Storage full — ignore
  }
}

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'LOAD_CART':
      return { ...state, items: action.items };
    case 'ADD_ITEM': {
      const existing = state.items.find(
        (i) => i.productId === action.item.productId && i.variantId === action.item.variantId
      );
      if (existing) {
        return {
          ...state,
          items: state.items.map((i) =>
            i.productId === action.item.productId && i.variantId === action.item.variantId
              ? { ...i, quantity: Math.min(i.quantity + action.item.quantity, 99) }
              : i
          ),
        };
      }
      return { ...state, items: [...state.items, action.item] };
    }
    case 'REMOVE_ITEM':
      return {
        ...state,
        items: state.items.filter(
          (i) => !(i.productId === action.productId && i.variantId === action.variantId)
        ),
      };
    case 'UPDATE_QUANTITY':
      if (action.quantity <= 0) {
        return {
          ...state,
          items: state.items.filter(
            (i) => !(i.productId === action.productId && i.variantId === action.variantId)
          ),
        };
      }
      return {
        ...state,
        items: state.items.map((i) =>
          i.productId === action.productId && i.variantId === action.variantId
            ? { ...i, quantity: Math.min(action.quantity, 99) }
            : i
        ),
      };
    case 'CLEAR_CART':
      return { ...state, items: [] };
    case 'OPEN_CART':
      return { ...state, isOpen: true };
    case 'CLOSE_CART':
      return { ...state, isOpen: false };
    default:
      return state;
  }
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, { items: [], isOpen: false });

  useEffect(() => {
    const saved = loadCartFromStorage();
    if (saved.length > 0) dispatch({ type: 'LOAD_CART', items: saved });
  }, []);

  useEffect(() => {
    saveCartToStorage(state.items);
  }, [state.items]);

  const addItem = useCallback((item: CartItem) => dispatch({ type: 'ADD_ITEM', item }), []);
  const removeItem = useCallback((productId: string, variantId: string) => dispatch({ type: 'REMOVE_ITEM', productId, variantId }), []);
  const updateQuantity = useCallback((productId: string, variantId: string, quantity: number) => dispatch({ type: 'UPDATE_QUANTITY', productId, variantId, quantity }), []);
  const clearCart = useCallback(() => dispatch({ type: 'CLEAR_CART' }), []);
  const openCart = useCallback(() => dispatch({ type: 'OPEN_CART' }), []);
  const closeCart = useCallback(() => dispatch({ type: 'CLOSE_CART' }), []);

  const totalItems = state.items.reduce((sum, i) => sum + i.quantity, 0);
  const totalPrice = state.items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  return (
    <CartContext.Provider value={{ ...state, addItem, removeItem, updateQuantity, clearCart, openCart, closeCart, totalItems, totalPrice }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
