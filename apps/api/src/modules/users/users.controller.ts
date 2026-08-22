import { Response, NextFunction } from 'express';
import { ExtendedRequest } from '../../middleware/error';
import { UserRepository, AddressRepository } from '../../db/repositories';
import { addressSchema, changePasswordSchema } from '@ecom/contracts';
import { AppError } from '../../lib/errors';
import { hashPassword, verifyPassword } from '../../lib/hash';
import { z } from 'zod';

const updateProfileSchema = z.object({
  name: z.string().min(2).optional(),
  phone: z.string().optional(),
  avatar: z.string().url().optional(),
});

const updatePreferencesSchema = z.object({
  marketingEmails: z.boolean(),
});

export const UsersController = {
  async getProfile(req: ExtendedRequest, res: Response, next: NextFunction) {
    try {
      const user = await UserRepository.findById(req.user!.id);
      if (!user) return next(AppError.notFound('User profile not found'));

      res.status(200).json({
        data: { user },
        meta: { requestId: req.requestId }
      });
    } catch (err) {
      next(err);
    }
  },

  async updateProfile(req: ExtendedRequest, res: Response, next: NextFunction) {
    try {
      const body = updateProfileSchema.parse(req.body);
      const updated = await UserRepository.update(req.user!.id, body);

      res.status(200).json({
        data: { user: updated },
        meta: { requestId: req.requestId }
      });
    } catch (err) {
      next(err);
    }
  },

  async updatePreferences(req: ExtendedRequest, res: Response, next: NextFunction) {
    try {
      const body = updatePreferencesSchema.parse(req.body);
      const updated = await UserRepository.update(req.user!.id, { preferences: body });

      res.status(200).json({
        data: { user: updated },
        meta: { requestId: req.requestId }
      });
    } catch (err) {
      next(err);
    }
  },

  async updatePassword(req: ExtendedRequest, res: Response, next: NextFunction) {
    try {
      const body = changePasswordSchema.parse(req.body);
      
      const userWithHash = await UserRepository.findByEmail(req.user!.email);
      if (!userWithHash) return next(AppError.notFound('User not found'));

      const isCurrentValid = await verifyPassword(body.currentPassword, userWithHash.passwordHash);
      if (!isCurrentValid) {
        return next(AppError.badRequest('Current password is incorrect', 'VALIDATION_ERROR', {
          currentPassword: 'Current password is incorrect'
        }));
      }

      const newHash = await hashPassword(body.newPassword);
      await UserRepository.update(req.user!.id, { passwordHash: newHash });

      res.status(200).json({
        data: { success: true, message: 'Password updated successfully' },
        meta: { requestId: req.requestId }
      });
    } catch (err) {
      next(err);
    }
  },

  async getAddresses(req: ExtendedRequest, res: Response, next: NextFunction) {
    try {
      const addresses = await AddressRepository.findByUser(req.user!.id);
      res.status(200).json({
        data: { addresses },
        meta: { requestId: req.requestId }
      });
    } catch (err) {
      next(err);
    }
  },

  async createAddress(req: ExtendedRequest, res: Response, next: NextFunction) {
    try {
      const body = addressSchema.parse(req.body);
      
      // If it is the first address, or isDefault is true, set others to non-default
      const existing = await AddressRepository.findByUser(req.user!.id);
      const isFirst = existing.length === 0;
      const isDefault = body.isDefault || isFirst;

      if (isDefault) {
        await AddressRepository.setAllNonDefault(req.user!.id);
      }

      const address = await AddressRepository.create({
        ...body,
        userId: req.user!.id,
        isDefault
      });

      res.status(201).json({
        data: { address },
        meta: { requestId: req.requestId }
      });
    } catch (err) {
      next(err);
    }
  },

  async updateAddress(req: ExtendedRequest, res: Response, next: NextFunction) {
    try {
      const addressId = req.params.id;
      const body = addressSchema.parse(req.body);

      // Verify ownership
      const existing = await AddressRepository.findById(addressId);
      if (!existing || existing.userId !== req.user!.id) {
        return next(AppError.notFound('Address not found'));
      }

      if (body.isDefault && !existing.isDefault) {
        await AddressRepository.setAllNonDefault(req.user!.id);
      }

      const updated = await AddressRepository.update(addressId, body);

      res.status(200).json({
        data: { address: updated },
        meta: { requestId: req.requestId }
      });
    } catch (err) {
      next(err);
    }
  },

  async deleteAddress(req: ExtendedRequest, res: Response, next: NextFunction) {
    try {
      const addressId = req.params.id;

      // Verify ownership
      const existing = await AddressRepository.findById(addressId);
      if (!existing || existing.userId !== req.user!.id) {
        return next(AppError.notFound('Address not found'));
      }

      await AddressRepository.delete(addressId);

      // If we deleted the default address, set another default if available
      if (existing.isDefault) {
        const remaining = await AddressRepository.findByUser(req.user!.id);
        if (remaining.length > 0) {
          await AddressRepository.update(remaining[0].id, { isDefault: true });
        }
      }

      res.status(200).json({
        data: { success: true },
        meta: { requestId: req.requestId }
      });
    } catch (err) {
      next(err);
    }
  }
};
