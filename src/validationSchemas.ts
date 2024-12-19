import { z } from 'zod';


export const mobileSchema = z.string()
    .min(1, { message: 'Mobile number is required' })
    .regex(/^\d*$/, { message: 'Mobile number has incorrect format' })
    .length(10, { message: 'Mobile number must be exactly 10 digits' });

export const nameSchema = z.string()
    .min(1, { message: 'Name is required' })
    .max(50, { message: 'Name must be less than 50 characters' })

export const requiredSchema = z.string()
    .min(1, { message: 'Name is required' })

export const requiredASchema = z.string()
    .min(1, { message: 'Name is required' })
    .regex(/^[A-Za-z\s]+$/, { message: 'Name must contain only alphabets ' });


export const emailSchema = z.string()
    .min(1, { message: 'Email is required' })
    .email({ message: 'Invalid email address' });

export const pincodeSchema = z.string()
    .min(1, { message: 'Pincode number is required' })
    .length(6, { message: 'Pincode must be exactly 6 digits' })
    .regex(/^\d{6}$/, { message: 'Pincode must contain only numbers' });

    export const gstSchema = z.string()
    .min(15, { message: 'GST number is required' })
    .length(15, { message: 'GST number must be exactly 15 characters long' })
    .regex(/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[0-9]{1}[A-Z]{1}[0-9]{1}$/, { message: 'Invalid GST Number' });

export const decimalSchema = z.string()
    .regex(/^\d+(\.\d+)?$/, { message: 'Input must be a valid number or decimal value' })
    .transform((val) => parseFloat(val));