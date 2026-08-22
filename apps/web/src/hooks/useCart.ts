import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../lib/api';
import { useSelector } from 'react-redux';
import type { RootState } from '../app/store';

export const cartKeys = {
  all: ['cart'] as const,
  detail: (userId: string) => [...cartKeys.all, userId] as const,
};

export const useCart = () => {
  const queryClient = useQueryClient();
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);
  const userId = user?.id || 'guest';

  // Fetch cart query
  const cartQuery = useQuery({
    queryKey: cartKeys.detail(userId),
    queryFn: async () => {
      const res = await api.get('/cart');
      return res.data.data;
    },
    enabled: isAuthenticated, // Only fetch cart when logged in
  });

  // Add item mutation
  const addToCartMutation = useMutation({
    mutationFn: async (payload: { productId: string; variantId?: string; qty: number }) => {
      const res = await api.post('/cart/items', payload);
      return res.data.data;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(cartKeys.detail(userId), data);
    },
  });

  // Sync cart items list mutation (PUT /cart)
  const syncCartMutation = useMutation({
    mutationFn: async (items: Array<{ productId: string; variantId?: string; qty: number }>) => {
      const res = await api.put('/cart', { items });
      return res.data.data;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(cartKeys.detail(userId), data);
    },
  });

  // Remove item mutation
  const removeFromCartMutation = useMutation({
    mutationFn: async (params: { productId: string; variantId?: string }) => {
      const res = await api.delete('/cart/items', { params });
      return res.data.data;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(cartKeys.detail(userId), data);
    },
  });

  // Apply Coupon mutation
  const applyCouponMutation = useMutation({
    mutationFn: async (code: string) => {
      const res = await api.post('/cart/coupon', { code });
      return res.data.data;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(cartKeys.detail(userId), data);
    },
  });

  // Remove Coupon mutation
  const removeCouponMutation = useMutation({
    mutationFn: async () => {
      const res = await api.delete('/cart/coupon');
      return res.data.data;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(cartKeys.detail(userId), data);
    },
  });

  return {
    cart: cartQuery.data || { items: [], couponCode: undefined, totals: { subtotalPaise: 0, discountPaise: 0, shippingPaise: 0, taxPaise: 0, totalPaise: 0 } },
    isLoading: cartQuery.isLoading && isAuthenticated,
    error: cartQuery.error,
    addToCart: addToCartMutation.mutateAsync,
    syncCart: syncCartMutation.mutateAsync,
    removeFromCart: removeFromCartMutation.mutateAsync,
    applyCoupon: applyCouponMutation.mutateAsync,
    removeCoupon: removeCouponMutation.mutateAsync,
    isUpdating: addToCartMutation.isPending || syncCartMutation.isPending || removeFromCartMutation.isPending || applyCouponMutation.isPending || removeCouponMutation.isPending,
  };
};
